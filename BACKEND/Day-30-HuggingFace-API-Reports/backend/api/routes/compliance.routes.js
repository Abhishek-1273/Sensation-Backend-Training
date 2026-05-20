import express from "express";
import { analyzeCompliance, getReports } from "../controllers/compliance.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/analyze", protect, analyzeCompliance);
router.get("/get-reports", protect, getReports);

export default router;
