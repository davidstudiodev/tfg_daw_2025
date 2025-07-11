
// Middleware para verificar si el usuario es administrador
export default function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Acceso solo para administradores.' });
}