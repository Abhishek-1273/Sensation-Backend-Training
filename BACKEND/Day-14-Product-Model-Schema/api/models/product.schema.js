import mongoose from 'mongoose';
import { randomUUID } from 'crypto';

const productSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: () => randomUUID(),
        unique: true,
        index: true
    },
    companyName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "organizationModel",
        required: true,
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
    },
    productCode: String,
    description: String,

    productType: {
        type: String,
        enum: ["drug", "medical_device", "software", "ai_system", "diagonistic", "other"]
    },
    image: [
        {
            url: String,
            publicId: String,
            label: String
        },
    ]

}, {
    timestamps: true
})

const Product = mongoose.model("Product", productSchema)

export { Product }