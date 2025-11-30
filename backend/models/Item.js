// backend/models/Item.js
import mongoose from "mongoose";

// Phone number validation regex
const phoneRegex = /^[\+]?[1-9][\d]{0,3}[\s\-\.]?[\(]?[\d]{1,3}[\)]?[\s\-\.]?[\d]{1,4}[\s\-\.]?[\d]{1,4}[\s\-\.]?[\d]{0,9}$/;

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["lost", "found"], required: true },
    title: { 
      type: String, 
      required: true, 
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: { 
      type: String, 
      required: true, 
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    category: { type: String, enum: ["electronics", "documents", "clothing", "accessories", "bags", "keys", "other"], required: true },
    location: { 
      type: String, 
      required: true, 
      trim: true,
      minlength: [3, 'Location must be at least 3 characters'],
      maxlength: [200, 'Location cannot exceed 200 characters']
    },
    images: [{ type: String }],
    contact: { 
      type: String, 
      trim: true,
      validate: {
        validator: function(v) {
          if (!v) return true;
          // Check if it's email or phone
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(v) || phoneRegex.test(v);
        },
        message: 'Contact must be a valid email or phone number'
      }
    },
    status: { type: String, enum: ["open", "claimed", "returned", "closed"], default: "open" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reporterName: { type: String },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    claimerName: { type: String },
    claimDate: { 
      type: Date,
      validate: {
        validator: function(v) {
          return !v || v <= new Date();
        },
        message: 'Claim date cannot be in the future'
      }
    },
    dateReported: { type: Date, default: Date.now },
    dateLostFound: {
      type: Date,
      validate: {
        validator: function(v) {
          return !v || v <= new Date();
        },
        message: 'Date lost/found cannot be in the future'
      }
    },
    reward: { 
      type: Number, 
      default: 0,
      min: [0, 'Reward cannot be negative'],
      max: [10000, 'Reward cannot exceed $10,000']
    },
    tags: [{ 
      type: String,
      trim: true,
      maxlength: [30, 'Each tag cannot exceed 30 characters']
    }],
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    hiddenDetails: {
      type: String,
      required: true,
      maxlength: [500, 'Hidden details cannot exceed 500 characters']
    },
    verificationChallenges: [{
      question: { type: String },
      answer: { type: String },
      createdAt: { type: Date, default: Date.now }
    }],
    claimAttempts: [{
      claimant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      hiddenDetailsProvided: String,
      challengeAnswers: [String],
      isVerified: { type: Boolean, default: false },
      attemptDate: { type: Date, default: Date.now }
    }],
    isPhotoBlurred: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Pre-save middleware to set reporter name and update user stats
itemSchema.pre('save', async function(next) {
  if (this.isNew && this.user) {
    try {
      const User = mongoose.model('User');
      const user = await User.findById(this.user);
      if (user) {
        this.reporterName = user.name;
        // Update user stats
        user.interactions.itemsReported += 1;
        user.helperScore += 5; // 5 points for reporting
        await user.save();
      }
    } catch (error) {
      console.error('Error setting reporter name:', error);
    }
  }
  next();
});

export default mongoose.model("Item", itemSchema);
