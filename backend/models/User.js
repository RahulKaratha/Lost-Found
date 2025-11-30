import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Phone number validation regex (supports various formats)
const phoneRegex = /^[\+]?[1-9][\d]{0,3}[\s\-\.]?[\(]?[\d]{1,3}[\)]?[\s\-\.]?[\d]{1,4}[\s\-\.]?[\d]{1,4}[\s\-\.]?[\d]{0,9}$/;

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true,
    match: [/^[^\s@]+@nie\.ac\.in$/, 'Email must end with @nie.ac.in']
  },
  password: { 
    type: String, 
    required: function() { return !this.googleId; },
    minlength: [6, 'Password must be at least 6 characters'],
    maxlength: [128, 'Password cannot exceed 128 characters']
  },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  phone: { 
    type: String, 
    trim: true, 
    default: '',
    validate: {
      validator: function(v) {
        return !v || phoneRegex.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  isVerified: { type: Boolean, default: false },
  googleId: { type: String, sparse: true },
  avatar: { type: String, default: '' },
  dateOfBirth: {
    type: Date,
    validate: {
      validator: function(v) {
        return !v || v <= new Date();
      },
      message: 'Date of birth cannot be in the future'
    }
  },
  helperScore: { type: Number, default: 0 },
  badges: [{ type: String }],
  interactions: {
    itemsReported: { type: Number, default: 0 },
    itemsReturned: { type: Number, default: 0 },
    challengesCompleted: { type: Number, default: 0 },
    positiveRatings: { type: Number, default: 0 }
  },
  verificationOTP: { type: String },
  otpExpires: { type: Date }
}, { timestamps: true });

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);