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
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('https://lost-found-eta.vercel.app');
  }
);

// Error handling for OAuth failures
router.get('/google/failure', (req, res) => {
  console.log('🔴 Google OAuth failed');
  const frontendURL = process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://lost-found-eta.vercel.app'
    : 'http://localhost:5173';
  res.redirect(`${frontendURL}/login?error=oauth_failed`);
});

export default router;