import express from 'express';
import { register, login, me, logout } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { registerLimiter, loginLimiter } from '../middlewares/rateLimiters.js';
import validateRequest from '../middlewares/validateRequest.js';
import { pool } from '../config/db.js';
import bcrypt from 'bcryptjs';

// Middleware para validar cambio de contraseña
import { body } from 'express-validator';
import { changePassword } from '../controllers/auth.controller.js';

// Middleware para recuperar contraseña
import { forgotPassword } from '../controllers/auth.controller.js';

// Middleware para resetear contraseña
import { resetPassword } from '../controllers/auth.controller.js';


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


// Recuperar contraseña
router.post(
  '/forgot-password',
  [body('email').isEmail()],
  validateRequest,
  forgotPassword
);


// Resetear contraseña
router.post(
  '/reset-password',
  [
    body('token').isString().notEmpty(),
    body('newPassword').isString().isLength({ min: 6 })
  ],
  validateRequest,
  resetPassword
);


// Cambiar correo electrónico del Administrador
router.put(
  '/change-email',
  authMiddleware,
  [
    body('email').isEmail(),
    body('currentPassword').isString().notEmpty()
  ],
  validateRequest,
  async (req, res) => {
    const userId = req.user.id;
    const { email, currentPassword } = req.body;
    try {
      const [[user]] = await pool.query('SELECT password FROM users WHERE id = ?', [userId]);
      if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'La contraseña actual no es correcta.' });
      await pool.query('UPDATE users SET email = ? WHERE id = ?', [email, userId]);
      res.json({ message: 'Correo actualizado correctamente.' });
    } catch (error) {
      console.error(error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'El correo ya está en uso.' });
      }
      res.status(500).json({ message: 'Error al actualizar el correo.' });
    }
  }
);


export default router;

