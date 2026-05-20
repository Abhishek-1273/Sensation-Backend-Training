import mongoose from "mongoose";
import { Product } from "../models/product.schema.js";
import { Report } from "../models/report.schema.js";

// helper — score → status
const getStatusFromScore = (score) => {
    if (score === null || score === undefined) return "not_analyzed";
    if (score >= 90) return "compliant";
    if (score >= 75) return "under_review";
    return "non_compliant";
};

// helper — attach latest report score to each product
const attachLatestScores = async (products, userId) => {
    const productIds = products.map((p) => p._id);

    // fetch latest report per product for this user
    const reports = await Report.aggregate([
        {
            $match: {
                product: { $in: productIds },
                createdBy: new mongoose.Types.ObjectId(userId),
            },
        },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: "$product",
                latestScore: { $first: "$complianceScore" },
                latestFramework: { $first: "$framework" },
            },
        },
    ]);

    const scoreMap = {};
    reports.forEach((r) => {
        scoreMap[r._id.toString()] = r.latestScore;
    });

    return products.map((p) => {
        const plain = p.toObject ? p.toObject() : { ...p };
        const score = scoreMap[plain._id.toString()] ?? null;
        plain.complianceScore = score;
        plain.complianceStatus = getStatusFromScore(score);
        return plain;
    });
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
    try {
        const {
            productName,
            productCode,
            description,
            productType,
            company,
            deviceClass,
            intendedUse,
            approvals,
            market,
        } = req.body;

        const parsedMarket =
            typeof market === "string" ? JSON.parse(market) : market || [];

        const parsedApprovals =
            typeof approvals === "string" ? JSON.parse(approvals) : approvals || [];

        const regulatory = {
            deviceClass,
            intendedUse,
            market: parsedMarket,
            approvals: parsedApprovals,
        };

        const images =
            req.files?.map((img) => ({
                url: img.path,
                publicId: img.filename,
            })) || [];

        const product = await Product.create({
            productName,
            productCode,
            description,
            productType,
            company,
            createdBy: req.user.id,
            // complianceScore & complianceStatus are NOT saved — driven by reports
            regulatory,
            images,
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({
            isActive: true,
            createdBy: req.user.id,
        })
            .populate("company", "legalName dbaName")
            .populate("createdBy", "userName email");

        if (!products || products.length === 0) {
            return res.status(200).json({ message: "No products found", data: [] });
        }

        const enriched = await attachLatestScores(products, req.user.id);

        return res.status(200).json({
            message: "Products fetched successfully",
            count: enriched.length,
            data: enriched,
        });
    } catch (err) {
        console.error("getAllProducts Error:", err.message);
        return res.status(500).json({ message: err.message });
    }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            _id: req.params.id,
            createdBy: req.user.id,
        })
            .populate("company", "legalName dbaName")
            .populate("createdBy", "userName email");

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const [enriched] = await attachLatestScores([product], req.user.id);

        return res.status(200).json({ data: enriched });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// GET PRODUCTS BY COMPANY
export const getProductsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const products = await Product.find({
            company: companyId,
            createdBy: req.user.id,
        });

        const enriched = await attachLatestScores(products, req.user.id);

        return res.status(200).json({ data: enriched });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// UPDATE PRODUCTS
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            productName, productCode, description, productType,
            company, complianceStatus, complianceScore,
            deviceClass, riskCategory, intendedUse, market,
            existingImages,
        } = req.body;
 
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ message: "Product not found" });
 
        // Parse markets
        const parsedMarket = typeof market === 'string'
            ? market.split(',').map(m => m.trim()).filter(Boolean)
            : market || [];
 
        // Keep existing images + add new ones
        const keptImages = existingImages ? JSON.parse(existingImages) : [];
        const newImages = req.files?.map(f => ({ url: f.path, publicId: f.filename })) || [];
        const allImages = [...keptImages, ...newImages];
 
        const updated = await Product.findByIdAndUpdate(
            id,
            {
                productName, productCode, description, productType,
                company, complianceStatus,
                complianceScore: Number(complianceScore),
                images: allImages,
                regulatory: {
                    deviceClass,
                    riskCategory,
                    intendedUse,
                    market: parsedMarket,
                    approvals: product.regulatory?.approvals || [],
                },
            },
            { new: true }
        ).populate("company", "legalName dbaName");
 
        return res.status(200).json({ message: "Product updated successfully", data: updated });
 
    } catch (err) {
        console.error("updateProduct Error:", err.message);
        return res.status(500).json({ message: err.message });
    }
};