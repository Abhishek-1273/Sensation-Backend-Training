import express from "express";
import { upload } from "../middleware/multer.js";
import {
    createProduct,
    getAllProducts,
    getProductById,
} from "../controllers/product.controller.js";
import { isUser, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, isUser, upload.array("images", 5), createProduct);
router.get("/get-products", protect, getAllProducts);
router.get("/get-product/:id", protect, getProductById);

export default router;