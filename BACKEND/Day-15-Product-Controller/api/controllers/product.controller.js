import { Product } from "../models/product.schema.js";

export const createProduct = async (req, res, next) => {
    try {
        const {
            productName,
            productCode,
            description,
            productType,
            company,
            complianceStatus,
            complianceScore,
            deviceClass,
            riskCategory,
            intendedUse,
            approvals,
            market,
        } = req.body;

        // ✅ Required fields check
        if (!productName || !company) {
            return res.status(400).json({
                message: "productName and company are required",
            });
        }

        // ✅ regulatory object build karo
        const regulatory = {
            deviceClass: deviceClass || "",
            riskCategory: riskCategory || undefined,
            intendedUse: intendedUse || "",
            market: market
                ? typeof market === "string"
                    ? JSON.parse(market)
                    : market
                : [],
            approvals: approvals
                ? typeof approvals === "string"
                    ? JSON.parse(approvals)
                    : approvals
                : [],
        };

        // ✅ Images - cloudinary se url aur public_id aata hai
        const images =
            req.files && req.files.length > 0
                ? req.files.map((img) => ({
                    url: img.path,       // cloudinary URL
                    publicId: img.filename, // cloudinary public_id
                }))
                : [];

        const product = await Product.create({
            productName,
            productCode,
            description,
            productType,
            company,
            createdBy: req.user.id,  // ✅ token se lo, body se nahi
            complianceStatus: complianceStatus || "draft",
            complianceScore: complianceScore || 0,
            regulatory,
            images,
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: product,
        });
    } catch (err) {
        console.error("Product Error:", err.message);
        return res.status(500).json({
            message: err.message,
        });
    }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({ isActive: true })
            .populate("company", "legalName dbaName")
            .populate("createdBy", "userName email");

        if (!products || products.length === 0) {
            return res.status(200).json({
                message: "No products found",
                data: [],
            });
        }

        return res.status(200).json({
            message: "Products fetched successfully",
            count: products.length,
            data: products,
        });
    } catch (err) {
        console.error("getAllProducts Error:", err.message);
        return res.status(500).json({
            message: err.message,
        });
    }
};

// GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("company", "legalName dbaName")
            .populate("createdBy", "userName email");

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        return res.status(200).json({
            data: product,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};