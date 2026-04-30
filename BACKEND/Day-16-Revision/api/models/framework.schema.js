import mongoose from "mongoose";
import { randomUUID } from "crypto";

const frameworkSchema = new mongoose.Schema({
    uuid: {
        type: String,
        default: () => randomUUID(), // auto-generate unique ID
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true, // naam zaroori hai
        trim: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true,
        uppercase: true // e.g. "ISO27001", "GDPR"
    },
    description: String,
    authority: {
        type: String, // kis organization ne banaya - e.g. "ISO", "NIST"
        trim: true
    },
    country: {
        type: String, // kis desh ke liye applicable hai
    },

    appliesTo: {
        type: [String],
        enum: ["company", "product"], // company-level ya product-level framework
    },
    industry: String, // e.g. "Healthcare", "Finance"
    version: {
        type: String,
        default: "1.0"
    },
    controls: [
        {
            controlid: String, // unique control identifier - e.g. "CC1.1"
            title: String,
            description: String,
            requirementText: String, // actual compliance requirement ka text
            mandatory: {
                type: Boolean,
                default: true, // by default sab controls mandatory hain
            },

            riskLevel: {
                type: String,
                enum: ["low", "medium", "high"],
                default: "medium"
            },
            tags: [String], // filtering ke liye - e.g. ["access-control", "encryption"]
        },
    ],
    isActive: {
        type: Boolean,
        default: true // soft delete ke liye - false = archived
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth" // kon sa user ne create kiya
    }
}, {
    timestamps: true // createdAt & updatedAt auto-add hoga
})

export const Framework = mongoose.model("Framework", frameworkSchema);