import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { register, login, getProfile, getUserById, updateProfile, verifyEmail } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// =========================
// Normal Authentication
// =========================
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.get("/user/:userId", protect, getUserById);
router.put("/profile", protect, updateProfile);

// =========================
// Google OAuth
// =========================

// Start Google login
router.get(
  "/google",
  (req, res, next) => {
    console.log("🔵 Google OAuth initiated");
    next();
  },
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "https://lost-found-eta.vercel.app/login"
  }),
  (req, res) => {
    // Generate JWT token
    const token = jwt.sign(
      { userId: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    // Send token to frontend via URL parameter
    res.redirect(`https://lost-found-eta.vercel.app/auth-success?token=${token}`);
  }
);

// Google OAuth failure route
router.get("/google/failure", (req, res) => {
  console.log("🔴 Google OAuth failed");
  res.redirect("https://lost-found-eta.vercel.app/login?error=oauth_failed"); // FIXED
});

export default router;
