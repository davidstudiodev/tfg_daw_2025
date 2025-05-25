import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { createUser, findUserByEmail } from '../models/User.js';
import { sendMail } from '../utils/mailer.js';

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await createUser({ name, email, password: hashedPassword, role });

    // Crear perfil en developers o companies según el rol
    if (role === 'dev') {
      await pool.query(
        `INSERT INTO developers (user_id, description, years_experience, location, tech_stack)
         VALUES (?, '', 0, '', '[]')`,
        [userId]
      );
    } else if (role === 'company') {
      await pool.query(
        `INSERT INTO companies (user_id, description, location)
         VALUES (?, '', '')`,
        [userId]
      );
    }

    // Enviar email de bienvenida
    await sendMail({
      to: email,
      subject: '¡Bienvenido a JobsXDevs!',
      html: `<h1>Hola ${name}!</h1><p>Gracias por registrarte en JobsXDevs.</p>`
    });

    res.status(201).json({ message: 'User created', userId });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ message: 'Server error', error: error.message || error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // 1) Verificar usuario
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // 2) Comparar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // 3) Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4) Enviar cookie HttpOnly
    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS solo en prod
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 día en ms
      })
      .status(200)
      .json({ message: 'Login exitoso' });

  } catch (error) {
    console.error('Auth login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const me = (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role
  });
};

// Borra la cookie del token
export const logout = (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    .status(200)
    .json({ message: 'Logged out' });
};


// Cambia la contraseña del usuario autenticado
export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    // 1. Busca el usuario por ID
    const [[user]] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    // 2. Verifica la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'La contraseña actual no es correcta.' });

    // 3. Hashea la nueva contraseña
    const hashed = await bcrypt.hash(newPassword, 10);

    // 4. Actualiza la contraseña
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);

    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};