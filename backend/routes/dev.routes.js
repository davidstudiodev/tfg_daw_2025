// routes/dev.routes.js
import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  getDeveloperProfile,
  updateDeveloperProfile
} from '../controllers/dev.controller.js'

const router = express.Router()

// Obtener perfil del dev (solo si está autenticado)
router.get('/profile', authMiddleware, getDeveloperProfile)

// Actualizar perfil del dev
router.put('/profile', authMiddleware, updateDeveloperProfile)

export default router
