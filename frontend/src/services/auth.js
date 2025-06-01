// src/services/auth.js
import api from './api.js';

// Registro simple (no devuelve token)
export const register = data =>
  api.post('/auth/register', data);

// Login que recibe la cookie HttpOnly
export const login = creds =>
  api.post('/auth/login', creds);

// Obtener el usuario actual desde /api/auth/me
export const getMe = () =>
  api.get('/auth/me');

// Logout que elimina la cookie HttpOnly
export const logout = () =>
  api.post('/auth/logout');