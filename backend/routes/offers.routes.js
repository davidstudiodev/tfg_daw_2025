import express from 'express';
import { listOffers, applyToOffer } from '../controllers/offers.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import { applyLimiter } from '../middlewares/rateLimiters.js';

const router = express.Router();

// Listar ofertas (público)
router.get('/', listOffers);

// Aplicar a una oferta (solo devs autenticados)
router.post('/:id/apply', applyLimiter, authMiddleware, applyToOffer);

export default router;
