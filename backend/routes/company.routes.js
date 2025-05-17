// routes/company.routes.js
import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  getCompanyProfile,
  updateCompanyProfile,
  createJob,
  listJobsByCompany
} from '../controllers/company.controller.js'

const router = express.Router()

// Perfil de la empresa
router.get('/profile', authMiddleware, getCompanyProfile)
router.put('/profile', authMiddleware, updateCompanyProfile)

// Gestión de ofertas
router.post('/jobs', authMiddleware, createJob)
router.get('/jobs', authMiddleware, listJobsByCompany)

export default router
