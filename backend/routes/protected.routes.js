import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// Ruta protegida de ejemplo para futuras funcionalidades
router.get('/dashboard', authMiddleware, (req, res) => {
  res.status(200).json({ message: `Welcome ${req.user.email}, you are a ${req.user.role}` });
});

export default router;