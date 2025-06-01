// middlewares/rateLimiters.js
import rateLimit from 'express-rate-limit';

// Limitar a 5 aplicaciones por minuto por IP
export const applyLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { message: 'Demasiadas solicitudes, intenta de nuevo en un minuto.' }
});

// Limitar a 3 registros por hora por IP
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { message: 'Demasiados registros desde esta IP, intenta más tarde.' }
});

// Limitar a 10 intentos de login por minuto por IP
export const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { message: 'Demasiados intentos de login, intenta de nuevo en un minuto.' }
});

// Limitar a 5 creaciones de ofertas por hora por empresa/IP
export const createJobLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Demasiadas ofertas creadas, intenta más tarde.' }
});
