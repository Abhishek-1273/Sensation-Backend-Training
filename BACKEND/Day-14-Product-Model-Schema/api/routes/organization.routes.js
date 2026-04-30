import express from 'express';
import { createOrganization, getAllCompanies } from '../controllers/organization.controller.js';
import { protect } from '../middleware/auth.middeware.js';

const router = express.Router();

router.post("/create", protect, createOrganization);

router.get("/get-companies", getAllCompanies)


// http://localhost:5000/api/organization/create

export default router;