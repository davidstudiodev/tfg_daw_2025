// controllers/dev.controller.js
import { pool } from '../config/db.js';
import { sendMail } from '../utils/mailer.js';

export const getDeveloperProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email,
              d.profession, d.phone,
              d.description, d.years_experience, d.location,
              d.tech_stack, d.avatar
       FROM users u
       JOIN developers d ON d.user_id = u.id
       WHERE u.id = ?`,
      [userId]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Developer profile not found' });
    }

    const profile = rows[0];

    // ![DEBUG] Log the profile before parsing
    console.log('Perfil dev antes de parsear:', profile);

    // Parse tech_stack safely, default to empty array
    if (!profile.tech_stack) {
      profile.tech_stack = [];
    } else if (typeof profile.tech_stack === 'string') {
      try {
        profile.tech_stack = JSON.parse(profile.tech_stack);
      } catch {
        profile.tech_stack = [];
      }
    }
    if (!Array.isArray(profile.tech_stack)) {
      profile.tech_stack = [];
    }
    profile.avatar = profile.avatar || '';

    res.json(profile);
  } catch (error) {
    console.error('Error fetching developer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDeveloperProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    name,
    email,
    profession,
    phone,
    description,
    years_experience,
    location,
    tech_stack,
    avatar
  } = req.body;
  
  try {

    // Actualiza la tabla users
    await pool.query(
      `UPDATE users SET name = ?, email = ? WHERE id = ?`,
      [name, email, userId]
    );

    // Actualiza la tabla developers
    await pool.query(
      `UPDATE developers
       SET profession      = ?,
           phone           = ?,
           description     = ?,
           years_experience= ?,
           location        = ?,
           tech_stack      = ?,
           avatar          = ?
       WHERE user_id = ?`,
      [
        profession,
        phone,
        description,
        years_experience,
        location,
        JSON.stringify(Array.isArray(tech_stack) ? tech_stack : []),
        avatar || '',
        userId
      ]
    );

    res.json({ message: 'Developer profile updated' });
  } catch (error) {
    console.error('Error updating developer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Obtener las ofertas a las que ha aplicado el dev
export const getDevApplications = async (req, res) => {
  const devId = req.user.id;
  try {
    const [apps] = await pool.query(
      `SELECT a.id as application_id, a.applied_at, j.*, u.name as company_name, c.avatar as company_avatar
       FROM applications a
       JOIN jobs j ON a.offer_id = j.id
       JOIN companies c ON j.company_id = c.user_id
       JOIN users u ON c.user_id = u.id
       WHERE a.dev_id = ?
       ORDER BY a.applied_at DESC`,
      [devId]
    );
    apps.forEach(app => {
      if (typeof app.tech_stack === 'string') {
        try { app.tech_stack = JSON.parse(app.tech_stack); } catch { app.tech_stack = []; }
      }
    });
    res.json(apps);
  } catch (error) {
    console.error('Error fetching dev applications:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Listar todos los developers
export const listDevelopers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
        u.id, u.name, u.email, d.avatar, d.profession, d.description, 
        d.years_experience, d.location, d.tech_stack
       FROM users u
       JOIN developers d ON d.user_id = u.id
       ORDER BY u.name ASC`
    );
    // Parsear tech_stack si es string
    const developers = rows.map(dev => ({
      ...dev,
      tech_stack: typeof dev.tech_stack === 'string'
        ? JSON.parse(dev.tech_stack)
        : (dev.tech_stack || [])
    }));
    res.json(developers);
  } catch (error) {
    console.error('Error listando developers:', error);
    res.status(500).json({ message: 'Error del servidor.' });
  }
};