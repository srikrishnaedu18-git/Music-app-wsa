import express from "express";
import { editProfile, forgotPassword, getMe, login, resetPassword, signup } from "../controllers/authController.js";
import { protect } from "../Middleware/authMiddleware.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me",protect,getMe);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);
router.patch("/profile",protect,editProfile);

export default router;