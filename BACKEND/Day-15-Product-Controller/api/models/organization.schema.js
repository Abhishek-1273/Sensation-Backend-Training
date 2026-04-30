import mongoose from "mongoose";
import { randomUUID } from "crypto";

const organizationSchema = new mongoose.Schema(
    {
        uuid: {
            type: String,
            default: () => randomUUID(),
            unique: true,
            index: true,
        },

        legalName: {
            type: String,
            required: true,
            trim: true,
        },

        dbaName: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },

        primaryContact: {
            name: String,
            email: {
                type: String,
                lowercase: true,
                trim: true,
            },
        },

        phoneNumber: String,
        website: String,

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        identifiers: {
            labellerCode: String,
            dunsNumber: String,   

            cin: String,         
            gstin: String,
            pan: String,

            cdsco: String,       

            others: String,
        },
    },
    {
        timestamps: true,
    }
);

export const organizationModel = mongoose.model("Organization", organizationSchema);