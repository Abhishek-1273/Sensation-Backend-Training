import mongoose from "mongoose";
import { randomUUID } from "crypto";

/*
  Organization Schema

  - legalName → Official registered name (e.g., Alphabet Inc.)
  - dbaName   → Public/brand name (e.g., Google)
  
*/

const organizationSchema = new mongoose.Schema(
    {
        // Unique identifier (safe for public APIs)
        uuid: {
            type: String,
            default: () => randomUUID(),
            unique: true,
            index: true,
        },

        // Legal registered name
        legalName: {
            type: String,
            required: true,
            trim: true,
        },

        // Brand / DBA name
        dbaName: {
            type: String,
            required: true,
            trim: true,
        },

        // ADDRESS
        address: {
            street: String,
            city: String,
            state: String,
            zip: String,
            country: String,
        },

        // CONTACT DETAILS (nested object)
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

        // SYSTEM FIELDS (backend controlled)

        // Reference to user who created this record
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Auth",
        },

        // Active/inactive status
        isActive: {
            type: Boolean,
            default: true,
        },

        // Soft delete timestamp (null = not deleted)
        deletedAt: {
            type: Date,
            default: null,
        },

        // REGULATORY IDENTIFIERS (country-specific IDs)
        identifiers: {
            // GLOBAL / US
            fdadei: String,       // FDA Establishment Identifier (Food and Drug Administration)
            labellerCode: String,
            dunsNumber: String,   // Business identification number (Data Universal Number System)

            // INDIA (Corporate)
            cin: String,          // Corporate Identification Number
            gstin: String,
            pan: String,

            // INDIA (Regulatory)
            cdsco: String,        // Central Drug Standard Control Organization

            // Miscellaneous
            others: String,
        },
    },
    {
        timestamps: true,
    }
);

export const Organization = mongoose.model("Organization", organizationSchema);