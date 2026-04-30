import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./api/routes/auth.routes.js";
import organizationRouter from "./api/routes/organization.routes.js";
import frameworkRouter from "./api/routes/framework.routes.js";
import productRouter from "./api/routes/product.routes.js";

dotenv.config();

const app = express();

// ----------------- Middleware ------------------
app.use(express.json());
app.use(cookieParser());

// ------------------- Routes --------------------
app.use("/api/auth", authRouter);
app.use("/api/organization", organizationRouter);
app.use("/api/framework", frameworkRouter);
app.use("/api/product", productRouter);

// ------------------- Global Error Handler --------------------
// ✅ Yeh Express v5 mein zaroori hai - 4 parameters hone chahiye
app.use((err, req, res, next) => {
    console.error("GLOBAL ERROR:", err.message);
    return res.status(err.status || 500).json({
        message: err.message || "Internal Server Error",
    });
});

export default app;