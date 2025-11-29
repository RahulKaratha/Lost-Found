import User from "../models/User.js";
import Item from "../models/Item.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const lostItems = await Item.countDocuments({ type: "lost", status: "open" });
    const foundItems = await Item.countDocuments({ type: "found", status: "open" });
    const claimedItems = await Item.countDocuments({ status: "claimed" });

    const recentItems = await Item.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: { totalUsers, totalItems, lostItems, foundItems, claimedItems },
      recentItems
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    // Prevent admin from changing their own role
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot change your own role" });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "Cannot delete your own account" });
    }

    await Item.deleteMany({ user: req.params.id });
    await User.findByIdAndDelete(req.params.id);
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("user", "name email")
      .populate("claimedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("user", "name email");
    
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};