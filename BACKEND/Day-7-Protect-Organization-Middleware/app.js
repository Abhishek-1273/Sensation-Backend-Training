import express from "express"
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authrouter from "./api/routes/auth.routes.js"
import organization from "./api/routes/organization.routes.js"

dotenv.config();

const app = express();

// ----------------- Middleware ------------------

app.use(express.json());
app.use(cookieParser());

// ------------------- Routes --------------------
app.use("/api/auth", authrouter)
app.use("/api/organization", organization)

// http://localhost:5000/api/auth/signup

export default app;
