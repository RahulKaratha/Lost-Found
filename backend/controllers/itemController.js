// backend/controllers/itemController.js
import Item from "../models/Item.js";

// Create item
export const createItem = async (req, res) => {
  try {
    const { type, title } = req.body;
    if (!type || !title) return res.status(400).json({ error: "type and title are required" });

    const newItem = new Item(req.body);
    await newItem.save();
    return res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Get all items (with optional filters)
export const getItems = async (req, res) => {
  try {
    const { type, search } = req.query;
    const filter = {};
    if (type && (type === "lost" || type === "found")) filter.type = type;
    if (search) {
      const q = new RegExp(search, "i");
      filter.$or = [{ title: q }, { description: q }, { location: q }];
    }
    const items = await Item.find(filter).sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Get single item by id
export const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    return res.json(item);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Update item
export const updateItem = async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: "Item not found" });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

// Delete item
export const deleteItem = async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Item not found" });
    return res.json({ message: "Item deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
