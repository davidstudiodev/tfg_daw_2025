import { pool } from '../config/db.js';

// Función para crear un nuevo usuario
export const createUser = async ({ name, email, password, role }) => {
  const [rows] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, password, role]
  );
  return rows.insertId;
};

// Función para encontrar un usuario por email
export const findUserByEmail = async (email) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};