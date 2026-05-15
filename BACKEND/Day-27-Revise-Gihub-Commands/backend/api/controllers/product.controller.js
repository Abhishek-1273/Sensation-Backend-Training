import { Product } from "../models/product.schema.js";

export const createProduct = async (req, res) => {
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
            intendedUse,
            approvals,
            market,
        } = req.body;

        // ✅ safe parsing
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

        // ✅ safe images
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
            complianceStatus,
            complianceScore: Number(complianceScore),
            regulatory,
            images,
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: product,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: error.message,
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

// GET PRODUCTS BY COMPANY
export const getProductsByCompany = async (req, res) => {
    try {
        const { companyId } = req.params;
        const products = await Product.find({ company: companyId, createdBy: req.user.id });
        return res.status(200).json({
            data: products,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};