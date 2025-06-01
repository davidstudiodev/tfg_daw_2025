// routes/dev.routes.js
import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import validateRequest from '../middlewares/validateRequest.js'
import { body } from 'express-validator'
import { getDeveloperProfile, updateDeveloperProfile, getDevApplications, deleteApplication } from '../controllers/dev.controller.js'
import { listDevelopers } from '../controllers/dev.controller.js';

const router = express.Router()

// Obtener perfil del dev (solo si está autenticado)
router.get('/profile', authMiddleware, getDeveloperProfile)

// Actualizar perfil del dev
router.put(
  '/profile',
  authMiddleware,
  [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('profession').isString().notEmpty(),
    body('phone').isString().notEmpty(),
    body('description').isString().isLength({ min: 10 }),
    body('years_experience').isInt({ min: 0 }),
    body('location').isString().notEmpty(),
    body('tech_stack')
      .isArray()
      .withMessage('tech_stack debe ser un array')
      .custom(arr =>
        arr.every(
          sec =>
            typeof sec === 'object' &&
            typeof sec.category === 'string' &&
            Array.isArray(sec.items)
        )
      )
      .withMessage('Cada elemento de tech_stack debe tener category:string e items:array'),
    body('avatar').optional().isString()
  ],
  validateRequest,
  updateDeveloperProfile
)

// Ver aplicaciones del dev
router.get('/applications', authMiddleware, getDevApplications)
// Eliminar una aplicación del dev
router.delete('/applications/:id', authMiddleware, deleteApplication)

// Listar todos los desarrolladores
router.get('/all', listDevelopers);

export default router
