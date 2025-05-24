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
    if (typeof profile.tech_stack === 'string') {
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
  const { profession, phone, description, years_experience, location, tech_stack, avatar } = req.body;
  try {
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
        JSON.stringify(tech_stack),
        avatar || '',
        userId
      ]
    );

    // Obtener email y nombre del dev
    const [rows] = await pool.query(
      `SELECT u.email, u.name FROM users u WHERE u.id = ?`,
      [userId]
    );
    if (rows.length) {
      await sendMail({
        to: rows[0].email,
        subject: 'Perfil publicado en JobsXDevs',
        html: `<h1>¡Hola ${rows[0].name}!</h1><p>Tu perfil ha sido publicado correctamente.</p><p>Puedes ver tu perfil publicado aquí: <a href="/developers">Ver todos los desarrolladores</a></p>`
      });
    }

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
