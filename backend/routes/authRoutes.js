import express from "express";
import passport from "passport";
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
    failureRedirect: "https://lost-found-eta.vercel.app/login",  // FIXED
    session: true
  }),
  (req, res) => {
    // OAuth success → redirect to frontend home/dashboard
    res.redirect("https://lost-found-eta.vercel.app"); // FIXED
  }
);

// Google OAuth failure route
router.get("/google/failure", (req, res) => {
  console.log("🔴 Google OAuth failed");
  res.redirect("https://lost-found-eta.vercel.app/login?error=oauth_failed"); // FIXED
});

export default router;
