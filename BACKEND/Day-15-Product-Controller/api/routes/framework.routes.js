import express from 'express';
import { createFramework, getFramework } from '../controllers/framework.controller.js';
import { protect, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/create', protect, isAdmin, createFramework);
router.get('/get-framework', getFramework);

export default router;