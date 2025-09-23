// backend/routes/itemRoutes.js
import express from "express";
import { createItem, getItems, getItem, updateItem, deleteItem } from "../controllers/itemController.js";

const router = express.Router();

router.post("/", createItem);     // create
router.get("/", getItems);        // list + filters
router.get("/:id", getItem);      // get single
router.put("/:id", updateItem);   // update
router.delete("/:id", deleteItem);// delete

export default router;
