import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { createUser, findUserByEmail } from '../models/User.js';
import { sendMail } from '../utils/mailer.js';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

// Verifica si el usuario ya existe y crea un nuevo usuario
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

// Inicia sesión verificando las credenciales del usuario
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Verificar usuario
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Comparar password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generar token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Enviar cookie HttpOnly
    return res
      .cookie('token', token, {
        httpOnly: true,
        secure: true, 
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 // 1 día en ms
      })
      .status(200)
      .json({ message: 'Login exitoso' });

  } catch (error) {
    console.error('Auth login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Obtiene los datos del usuario autenticado
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
      secure: true,
      sameSite: 'none'
    })
    .status(200)
    .json({ message: 'Logged out' });
};


// Cambia la contraseña del usuario autenticado
export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    // Busca el usuario por ID
    const [[user]] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [userId]
    );
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });

    // Verifica la contraseña actual
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'La contraseña actual no es correcta.' });

    // Hashea la nueva contraseña
    const hashed = await bcrypt.hash(newPassword, 10);

    // Actualiza la contraseña
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, userId]);

    res.json({ message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};


// Envía un enlace de recuperación de contraseña al email del usuario
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    // Busca usuario por email (dev o company)
    const [[user]] = await pool.query('SELECT id, email FROM users WHERE email = ?', [email]);
    if (!user) return res.status(200).json({ message: 'Si el email existe, se enviará un enlace.' });

    // Genera token y guarda en DB (puedes crear una tabla password_resets)
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await pool.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
      [user.id, token, expires]
    );

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    await sendMail({
      to: user.email,
      subject: 'Recupera tu contraseña',
      html: `
        <p>Hola,</p>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Si no solicitaste este cambio, ignora este correo.</p>
      `
    });

    res.json({ message: 'Si el email existe, se enviará un enlace.' });
  } catch (error) {
    console.error('Error en forgotPassword:', error, error.response?.data || error.message || error);
    res.status(500).json({ 
      message: 'No se pudo enviar el correo. Intenta de nuevo.', 
      error: error.message || error.toString() 
    });
  }
};


// Resetea la contraseña del usuario usando el token enviado por email
export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    // Busca el token válido y no expirado
    const [[reset]] = await pool.query(
      'SELECT * FROM password_resets WHERE token = ? AND expires_at > NOW()',
      [token]
    );
    if (!reset) return res.status(400).json({ message: 'Token inválido o expirado.' });

    // Actualiza la contraseña del usuario
    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashed, reset.user_id]);

    // Elimina el token usado
    await pool.query('DELETE FROM password_resets WHERE id = ?', [reset.id]);

    res.json({ message: 'Contraseña restablecida correctamente.' });
  } catch (error) {
    console.error('Error en resetPassword:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};