import express from 'express';
import Chat from '../models/Chat.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get chat for an item
router.get('/item/:itemId', protect, async (req, res) => {
  try {
    const { itemId } = req.params;
    
    let chat = await Chat.findOne({ item: itemId })
      .populate('participants.user', 'name email')
      .populate('messages.sender', 'name email')
      .populate('item', 'title user');

    if (!chat) {
      chat = new Chat({
        item: itemId,
        participants: [{ user: req.user._id, role: 'reporter' }],
        messages: []
      });
      await chat.save();
      await chat.populate('participants.user', 'name email');
      await chat.populate('item', 'title user');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all chats for a user
router.get('/my-chats', protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      'participants.user': req.user._id,
      isActive: true
    })
    .populate('participants.user', 'name email')
    .populate('item', 'title category images')
    .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;