// routes/company.routes.js
import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  getCompanyProfile,
  updateCompanyProfile,
  createJob,
  getCompanyJobs,
  updateJob,
  deleteJob
} from '../controllers/company.controller.js'

const router = express.Router()

// Perfil de la empresa
router.get('/profile', authMiddleware, getCompanyProfile)
router.put('/profile', authMiddleware, updateCompanyProfile)

// Gestión de ofertas
router.post('/jobs', authMiddleware, createJob)
router.get('/jobs', authMiddleware, getCompanyJobs)
router.put('/jobs/:id', authMiddleware, updateJob)
router.delete('/jobs/:id', authMiddleware, deleteJob)

export default router
