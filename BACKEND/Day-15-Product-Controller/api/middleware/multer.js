import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary.js";
import multer from "multer";

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: "compliance_analysis",
            format: "jpg",        // force convert
            resource_type: "auto" // ✅ image + pdf dono handle karega
        };
    }
});

export const upload = multer({ storage });