import express from "express";
import { registerUser, authUser, getUserprofile, updateUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { googleLogin } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/google-login", googleLogin);
router.route("/profile").get(protect, getUserprofile).put(protect, updateUserProfile);

export default router;
