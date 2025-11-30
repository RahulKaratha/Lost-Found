import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Chat from '../models/Chat.js';

export const initializeSocket = (io) => {
  // Authentication middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id || decoded.userId;
      const user = await User.findById(userId).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`🟢 User connected: ${socket.user.email}`);

    // Join item-specific chat room
    socket.on('join-chat', async (itemId) => {
      try {
        const roomName = `item-${itemId}`;
        socket.join(roomName);
        socket.currentRoom = roomName;
        console.log(`📱 ${socket.user.email} joined chat for item ${itemId}`);

        // Get or create chat
        let chat = await Chat.findOne({ item: itemId })
          .populate('participants.user', 'name email')
          .populate('messages.sender', 'name email');

        if (!chat) {
          chat = new Chat({
            item: itemId,
            participants: [{ user: socket.userId, role: 'reporter' }],
            messages: []
          });
          await chat.save();
        }

        // Send chat history
        socket.emit('chat-history', chat.messages);
      } catch (error) {
        socket.emit('error', 'Failed to join chat');
      }
    });

    // Handle new messages
    socket.on('send-message', async (data) => {
      try {
        const { itemId, content } = data;
        
        if (!content || content.trim().length === 0) {
          return socket.emit('error', 'Message cannot be empty');
        }

        const chat = await Chat.findOne({ item: itemId });
        if (!chat) {
          return socket.emit('error', 'Chat not found');
        }

        // Add user to participants if not already there
        const isParticipant = chat.participants.some(p => p.user.toString() === socket.userId);
        if (!isParticipant) {
          chat.participants.push({ user: socket.userId, role: 'claimer' });
        }

        // Add message
        const message = {
          sender: socket.userId,
          content: content.trim(),
          timestamp: new Date()
        };

        chat.messages.push(message);
        await chat.save();

        // Populate sender info for broadcast
        await chat.populate('messages.sender', 'name email');
        const populatedMessage = chat.messages[chat.messages.length - 1];

        // Broadcast to all users in the room
        const roomName = `item-${itemId}`;
        io.to(roomName).emit('new-message', populatedMessage);

        console.log(`💬 Message sent in ${roomName} by ${socket.user.email}`);
      } catch (error) {
        socket.emit('error', 'Failed to send message');
      }
    });

    // Handle typing indicators
    socket.on('typing', (itemId) => {
      const roomName = `item-${itemId}`;
      socket.to(roomName).emit('user-typing', {
        userId: socket.userId,
        name: socket.user.name
      });
    });

    socket.on('stop-typing', (itemId) => {
      const roomName = `item-${itemId}`;
      socket.to(roomName).emit('user-stop-typing', {
        userId: socket.userId
      });
    });

    socket.on('disconnect', () => {
      console.log(`🔴 User disconnected: ${socket.user.email}`);
    });
  });
};