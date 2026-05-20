import express from "express";
import { upload } from "../middleware/multer.js";
import {
    createProduct,
    getAllProducts,
    updateProduct,
    getProductById,
    getProductsByCompany,
} from "../controllers/product.controller.js";
import { isUser, protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protect, isUser, upload.array("images", 5), createProduct);
router.put('/update/:id', protect, upload.array('images', 5), updateProduct);
router.get("/get-products", protect, getAllProducts);
router.get("/get-product/:id", protect, getProductById);
router.get("/get-by-company/:companyId", protect, getProductsByCompany);

export default router;