// backend/models/Item.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["lost", "found"], required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    location: { type: String, trim: true },
    image: { type: String }, // image URL or base64 string (optional)
    contact: { type: String, trim: true }, // optional contact info
    status: { type: String, enum: ["open", "claimed", "returned"], default: "open" }
  },
  { timestamps: true }
);

export default mongoose.model("Item", itemSchema);
