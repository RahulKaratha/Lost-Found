import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

dotenv.config();

console.log('🔵 Initializing Google OAuth Strategy');
console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Present' : 'Missing');
console.log('Client Secret:', process.env.GOOGLE_CLIENT_SECRET ? 'Present' : 'Missing');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  console.log('🔵 Google OAuth callback triggered');
  console.log('Profile ID:', profile.id);
  console.log('Profile Email:', profile.emails[0]?.value);
  console.log('Profile Name:', profile.displayName);
  
  try {
    // Check if user already exists with this Google ID
    let user = await User.findOne({ googleId: profile.id });
    console.log('Existing Google user found:', !!user);
    
    if (user) {
      console.log('🟢 Returning existing Google user');
      return done(null, user);
    }
    
    // Check email domain
    const email = profile.emails[0].value;
    console.log('Checking email domain:', email);
    if (!email.endsWith('@nie.ac.in')) {
      console.log('🔴 Email domain not allowed:', email);
      return done(new Error('Only @nie.ac.in email addresses are allowed'), null);
    }
    
    // Check if user exists with same email
    user = await User.findOne({ email });
    console.log('Existing email user found:', !!user);
    
    if (user) {
      console.log('🟢 Linking Google account to existing user');
      // Link Google account to existing user
      user.googleId = profile.id;
      user.avatar = profile.photos[0]?.value || '';
      user.isVerified = true;
      await user.save();
      return done(null, user);
    }
    
    console.log('🟢 Creating new Google user');
    // Create new user
    user = new User({
      googleId: profile.id,
      name: profile.displayName,
      email,
      avatar: profile.photos[0]?.value || '',
      isVerified: true
    });
    
    await user.save();
    console.log('🟢 New Google user created:', user.email);
    done(null, user);
  } catch (error) {
    console.error('🔴 Google OAuth error:', error);
    done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;