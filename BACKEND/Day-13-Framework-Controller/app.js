import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRouter from "./api/routes/auth.routes.js";
import organizationRouter from "./api/routes/organization.routes.js";
import frameworkRouter from "./api/routes/framework.routes.js";

dotenv.config();

const app = express();

// ----------------- Middleware ------------------

app.use(express.json());
app.use(cookieParser());

// ------------------- Routes --------------------
app.use("/api/auth", authRouter)
app.use("/api/organization", organizationRouter)

app.use("/api/framework", frameworkRouter)

// http://localhost:5000/api/auth/signup

export default app;
