// src/services/auth.js
import api from './api.js';

// Registro simple (no devuelve token)
export const register = data =>
  api.post('/api/auth/register', data);

// Login que recibe la cookie HttpOnly
export const login = creds =>
  api.post('/api/auth/login', creds);

// Obtener el usuario actual desde /api/auth/me
export const getMe = () =>
  api.get('/api/auth/me');

// Logout que elimina la cookie HttpOnly
export const logout = () =>
  api.post('/api/auth/logout');