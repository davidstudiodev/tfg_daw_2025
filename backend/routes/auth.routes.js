import express from 'express';
import { register, login, me, logout } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { registerLimiter, loginLimiter } from '../middlewares/rateLimiters.js';

const router = express.Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);

router.get('/me', authMiddleware, me);
router.post('/logout', authMiddleware, logout);

export default router;

