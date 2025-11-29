// backend/models/Item.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["lost", "found"], required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: ["electronics", "documents", "clothing", "accessories", "bags", "keys", "other"], required: true },
    location: { type: String, required: true, trim: true },
    images: [{ type: String }],
    contact: { type: String, trim: true },
    status: { type: String, enum: ["open", "claimed", "returned", "closed"], default: "open" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    claimDate: { type: Date },
    reward: { type: Number, default: 0 },
    tags: [{ type: String }],
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" }
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
