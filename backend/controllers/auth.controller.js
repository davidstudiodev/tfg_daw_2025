import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../config/db.js';
import { createUser, findUserByEmail } from '../models/User.js';

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

    res.status(201).json({ message: 'User created', userId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
