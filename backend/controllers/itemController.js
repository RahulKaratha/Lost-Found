import Item from "../models/Item.js";

export const getItems = async (req, res) => {
  try {
    const { type, search, category, status, userId } = req.query;
    let filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (userId) filter.user = userId;
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } }
      ];
    }
    
    const items = await Item.find(filter)
      .populate("user", "name email phone")
      .populate("claimedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    const item = new Item({ ...req.body, user: req.user._id });
    const savedItem = await item.save();
    const populatedItem = await Item.findById(savedItem._id).populate("user", "name email phone");
    res.status(201).json(populatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("user", "name email phone")
      .populate("claimedBy", "name email");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    
    if (item.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this item" });
    }
    
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("user", "name email phone");
    res.json(updatedItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    
    if (item.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this item" });
    }
    
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const claimItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    
    if (item.status !== "open") {
      return res.status(400).json({ message: "Item is not available for claiming" });
    }
    
    if (item.user.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot claim your own item" });
    }
    
    item.claimedBy = req.user._id;
    item.status = "claimed";
    item.claimDate = new Date();
    
    await item.save();
    const populatedItem = await Item.findById(item._id)
      .populate("user", "name email phone")
      .populate("claimedBy", "name email");
    
    res.json(populatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserItems = async (req, res) => {
  try {
    const items = await Item.find({ user: req.user._id })
      .populate("claimedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClaimedItems = async (req, res) => {
  try {
    const items = await Item.find({ claimedBy: req.user._id })
      .populate("user", "name email phone")
      .sort({ claimDate: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};