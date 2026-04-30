export const createOrganization = async (req, res, next) => {
    try {
        // query
        return res.status(201).json({
            message: "Organization create successfully",
        })
    } catch (err) {
        return res.status(500).json({
            message: err.message
        })
    }
}