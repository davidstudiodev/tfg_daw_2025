// models/Application.js
import { pool } from '../config/db.js';

// Crea una nueva aplicación para una oferta de trabajo
export const createApplication = async ({ offerId, devId }) => {
  const [rows] = await pool.query(
    'INSERT INTO applications (offer_id, dev_id, applied_at) VALUES (?, ?, NOW())',
    [offerId, devId]
  );
  return rows.insertId;
};

// Verifica si un desarrollador ya ha aplicado a una oferta
export const hasApplied = async ({ offerId, devId }) => {
  const [rows] = await pool.query(
    'SELECT id FROM applications WHERE offer_id = ? AND dev_id = ?',
    [offerId, devId]
  );
  return rows.length > 0;
};
