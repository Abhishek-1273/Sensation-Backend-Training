import express from "express"
import dotenv from "dotenv"
import authrouter from "./api/routes/auth.routes.js"

dotenv.config();

const app = express();

// ----------------- Middleware ------------------

app.use(express.json())

// ------------------- Routes --------------------
app.use("/api/auth", authrouter)

// http://localhost:5000/api/auth/signup

export default app;
