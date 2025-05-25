import express from 'express';
import { register, login, me, logout } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { registerLimiter, loginLimiter } from '../middlewares/rateLimiters.js';
import validateRequest from '../middlewares/validateRequest.js';

// Middleware para validar cambio de contraseña
import { body } from 'express-validator';
import { changePassword } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', registerLimiter, register);
router.post('/login', loginLimiter, login);

router.get('/me', authMiddleware, me);
router.post('/logout', authMiddleware, logout);

// Cambiar contraseña
router.put(
  '/change-password',
  authMiddleware,
  [
    body('currentPassword').isString().notEmpty(),
    body('newPassword').isString().isLength({ min: 6 })
  ],
  validateRequest,
  changePassword
);


export default router;

