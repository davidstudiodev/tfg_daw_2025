// controllers/dev.controller.js
import { pool } from '../config/db.js';

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
    res.json({ message: 'Developer profile updated' });
  } catch (error) {
    console.error('Error updating developer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
