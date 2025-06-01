// routes/company.routes.js
import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import {
  getCompanyProfile,
  updateCompanyProfile,
  createJob,
  getCompanyJobs,
  updateJob,
  deleteJob,
  getCompanyApplications
} from '../controllers/company.controller.js'
import { createJobLimiter } from '../middlewares/rateLimiters.js'
import { body } from 'express-validator';
import validateRequest from '../middlewares/validateRequest.js';

const router = express.Router()

// Perfil de la empresa
router.get('/profile', authMiddleware, getCompanyProfile)
router.put(
  '/profile',
  authMiddleware,
  [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('avatar').optional().isString(),
    body('location').isString().notEmpty(),
    body('phone').isString().notEmpty(),
    body('description').isString().isLength({ max: 50 })
  ],
  validateRequest,
  updateCompanyProfile
)

// Gestión de ofertas
router.post(
  '/jobs',
  createJobLimiter,
  authMiddleware,
  [
    body('puesto').isString().isLength({ max: 20 }),
    body('sector').isString().notEmpty(),
    body('salary').isNumeric(),
    body('work_mode').isIn(['remoto', 'hibrido', 'local']),
    body('work_time').isIn(['completa', 'parcial', 'practicas']),
    body('tech_stack').isArray()
  ],
  validateRequest,
  createJob
)
router.get('/jobs', authMiddleware, getCompanyJobs)
router.put('/jobs/:id', authMiddleware, [
  body('puesto').isString().isLength({ max: 20 }),
  body('sector').isString().notEmpty(),
  body('salary').isNumeric(),
  body('work_mode').isIn(['remoto', 'hibrido', 'local']),
  body('work_time').isIn(['completa', 'parcial', 'practicas']),
  body('tech_stack').isArray()
], validateRequest, updateJob)
router.delete('/jobs/:id', authMiddleware, deleteJob)

// Ver aplicaciones a las ofertas
router.get('/applications', authMiddleware, getCompanyApplications)

export default router
