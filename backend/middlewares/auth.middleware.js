import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  // Leer el token desde la cookie HttpOnly
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  try {
    // Verificar y extraer el payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

export default authMiddleware;