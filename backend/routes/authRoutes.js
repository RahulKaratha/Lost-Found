import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login, getProfile, getUserById, updateProfile, verifyEmail } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.get("/user/:userId", protect, getUserById);
router.put("/profile", protect, updateProfile);

// Google OAuth routes
router.get('/google', (req, res, next) => {
  console.log('🔵 Google OAuth initiated');
  console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing');
  console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Missing');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  (req, res, next) => {
    console.log('🔵 Google OAuth callback received');
    console.log('Query params:', req.query);
    next();
  },
  passport.authenticate('google', { 
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    console.log('🟢 Google OAuth success');
    console.log('User:', req.user ? req.user.email : 'No user');
    
    try {
      // Generate JWT token
      const token = jwt.sign(
        { userId: req.user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      console.log('🟢 JWT token generated');
      
      // Redirect to frontend with token
      const frontendURL = process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL || 'https://your-frontend-domain.com'
        : 'http://localhost:5173';
      
      console.log('🔵 Redirecting to:', `${frontendURL}/auth/callback?token=${token}`);
      res.redirect(`${frontendURL}/auth/callback?token=${token}`);
    } catch (error) {
      console.error('🔴 OAuth callback error:', error);
      const frontendURL = process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL || 'https://your-frontend-domain.com'
        : 'http://localhost:5173';
      res.redirect(`${frontendURL}/login?error=oauth_failed`);
    }
  }
);

// Error handling for OAuth failures
router.get('/google/failure', (req, res) => {
  console.log('🔴 Google OAuth failed');
  const frontendURL = process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://your-frontend-domain.com'
    : 'http://localhost:5173';
  res.redirect(`${frontendURL}/login?error=oauth_failed`);
});

export default router;