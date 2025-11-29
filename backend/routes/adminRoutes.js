import express from "express";
import { 
  getDashboardStats, 
  getAllUsers, 
  updateUserRole, 
  deleteUser,
  getAllItems,
  updateItemStatus 
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.use(admin);

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/items", getAllItems);
router.put("/items/:id/status", updateItemStatus);

export default router;