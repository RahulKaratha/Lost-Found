import express from "express";
import { 
  createItem, 
  getItems, 
  getItem, 
  updateItem, 
  deleteItem,
  claimItem,
  getUserItems,
  getClaimedItems,
  getPendingClaimRequests
} from "../controllers/itemController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getItems);
router.get("/my-items", protect, getUserItems);
router.get("/claimed", protect, getClaimedItems);
router.get("/pending-claims", protect, getPendingClaimRequests);
router.get("/:id", getItem);
router.post("/", protect, createItem);
router.put("/:id", protect, updateItem);
router.delete("/:id", protect, deleteItem);
router.post("/:id/claim", protect, claimItem);

export default router;