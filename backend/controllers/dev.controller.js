// controllers/dev.controller.js
import { pool } from '../config/db.js';

export const getDeveloperProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, d.description,
              d.years_experience, d.location, d.tech_stack
       FROM users u
       JOIN developers d ON d.user_id = u.id
       WHERE u.id = ?`,
      [userId]
    );
    if (!rows.length) {
      return res.status(404).json({ message: 'Developer profile not found' });
    }

    const profile = rows[0];

    // Parse tech_stack safely, default to empty array
    let techStack;
    try {
      techStack = JSON.parse(profile.tech_stack);
    } catch {
      techStack = [];
    }
    profile.tech_stack = techStack;

    res.json(profile);
  } catch (error) {
    console.error('Error fetching developer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateDeveloperProfile = async (req, res) => {
  const userId = req.user.id;
  const { description, years_experience, location, tech_stack } = req.body;
  try {
    await pool.query(
      `UPDATE developers
       SET description = ?, years_experience = ?, location = ?, tech_stack = ?
       WHERE user_id = ?`,
      [description, years_experience, location, JSON.stringify(tech_stack), userId]
    );
    res.json({ message: 'Developer profile updated' });
  } catch (error) {
    console.error('Error updating developer profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
