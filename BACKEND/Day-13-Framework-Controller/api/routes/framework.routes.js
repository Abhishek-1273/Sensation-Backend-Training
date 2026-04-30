import express from 'express';
import { createFramework, getFramework } from '../controllers/framework.controller.js';
import { protect } from '../middleware/auth.middeware.js';

const router = express.Router();

router.post('/framework', protect, createFramework);
router.get('/get-framework', getFramework);

export default router;