import express from "express";
import { upload } from "../middleware/multer.js";
import {
    createProduct,
    getAllProducts,
    getProductById,
} from "../controllers/product.controller.js";
import { isUser, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// ✅ Multer error handle karo properly
const uploadMiddleware = (req, res, next) => {
    upload.array("images", 5)(req, res, (err) => {
        if (err) {
            console.error("Upload Error:", err.message);
            return res.status(400).json({
                message: "File upload failed: " + err.message,
            });
        }
        next();
    });
};

router.post("/create", protect, isUser, uploadMiddleware, createProduct);
router.get("/get-products", protect, getAllProducts);
router.get("/get-product/:id", protect, getProductById);

export default router;