import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized - No token",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized - Invalid token",
        });
    }
};

export const isAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                message: "Forbidden - Admins only",
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};

export const isUser = (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "Unauthorized",
            });
        }

        if (req.user.role !== "user") {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        next();
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};