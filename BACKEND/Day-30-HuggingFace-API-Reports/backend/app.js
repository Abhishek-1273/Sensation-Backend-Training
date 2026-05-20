import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRouter from "./api/routes/auth.routes.js";
import organizationRouter from "./api/routes/organization.routes.js";
import frameworkRouter from "./api/routes/framework.routes.js";
import productRouter from "./api/routes/product.routes.js";
import complianceRouter from "./api/routes/compliance.routes.js";

dotenv.config();

const app = express();

// ----------------- CORS ------------------
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

// ----------------- Middleware ------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ------------------- Routes --------------------
app.use("/api/auth", authRouter);
app.use("/api/organization", organizationRouter);
app.use("/api/framework", frameworkRouter);
app.use("/api/product", productRouter);
app.use("/api/compliance", complianceRouter);

export default app;
