import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail, generateOTP } from '../utils/emailService.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

export const register = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth } = req.body;
    
    // Enhanced validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    
    if (name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters" });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    
    // Email format and domain validation
    const emailRegex = /^[^\s@]+@nie\.ac\.in$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email must end with @nie.ac.in" });
    }
    
    // Phone validation if provided
    if (phone && phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,3}[\s\-\.]?[\(]?[\d]{1,3}[\)]?[\s\-\.]?[\d]{1,4}[\s\-\.]?[\d]{1,4}[\s\-\.]?[\d]{0,9}$/;
      if (!phoneRegex.test(phone.trim())) {
        return res.status(400).json({ message: "Please enter a valid phone number" });
      }
    }
    
    // Date of birth validation if provided
    if (dateOfBirth) {
      const dob = new Date(dateOfBirth);
      if (dob > new Date()) {
        return res.status(400).json({ message: "Date of birth cannot be in the future" });
      }
      if (dob < new Date('1900-01-01')) {
        return res.status(400).json({ message: "Please enter a valid date of birth" });
      }
    }
    
    const userExists = await User.findOne({ email: email ? email.toLowerCase() : '' });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password, 
      phone: phone ? phone.trim() : '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
    });
    
    // Generate and send OTP
    const otp = generateOTP();
    user.verificationOTP = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();
    
    // Send verification email
    const emailResult = await sendVerificationEmail(user.email, otp);
    if (!emailResult.success) {
      return res.status(500).json({ message: 'Failed to send verification email' });
    }

    res.status(201).json({
      message: 'Registration successful! Please check your email for verification code.',
      userId: user._id,
      email: user.email
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(400).json({ message: error.message || "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: "Valid email and password are required" });
    }
    
    const user = await User.findOne({ email: email ? email.toLowerCase() : '' });
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

export const getProfile = async (req, res) => {
  res.json(req.user);
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password -verificationOTP -otpExpires');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.verificationOTP || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP expired or invalid' });
    }
    
    if (user.verificationOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    user.isVerified = true;
    user.verificationOTP = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    const token = generateToken(user._id);
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      token
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};