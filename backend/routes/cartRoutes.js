import express , { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import{
    getcart,
    addToCart,
    removeFromCart,
    clearCart,
} from "../controllers/cartController.js"

const router = express.Router();

router.get("/" , protect , getcart);
router.post("/" , protect , addToCart);
router.delete("/:productId" , protect , removeFromCart);
router.delete("/" , protect , clearCart);

export default router;