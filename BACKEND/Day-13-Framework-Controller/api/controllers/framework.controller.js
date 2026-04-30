import { Framework } from "../models/framework.model.js";

const createFramework = async (req, res) => {
    try {
        const { name, shortCode, description, authority, country, version, industry, controls } = req.body;

        if (!name || !shortCode || !description || !authority || !country || !industry || !controls) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }

        const findFramework = {
            $or: [{ shortCode }, { version }],
        }

        const isFrameworkExist = await Framework.findOne(findFramework)
        if (isFrameworkExist) {
            return res.status(400).json({
                message: "Framework is already exist"
            })
        }
        const framework = await Framework.create({
            name,
            shortCode,
            description,
            authority,
            country,
            version,
            industry,
            controls,
            createdBy: req.user.id
        })

        return res.status(201).json({
            message: "Framework is created"
        })

    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

const getFramework = async (req, res) => {
    try {
        const framework = await Framework.find({ isActive: true });
        if (framework.length === 0) {
            return res.status(400).json({
                message: "No framework exist"
            })
        }
        return res.status(200).json({
            data: framework
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}

export { createFramework, getFramework };