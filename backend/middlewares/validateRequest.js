// middlewares/validateRequest.js
import { validationResult } from 'express-validator';

// Middleware para validar las solicitudes
export default function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}
