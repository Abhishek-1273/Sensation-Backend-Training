import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary.js";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "compliance-analysics",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "pdf"]
    }
});

export const upload = multer({ storage });