import { pool } from '../config/db.js';

export const getCompanyProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, c.description, c.location
       FROM users u
       JOIN companies c ON c.user_id = u.id
       WHERE u.id = ?`,
      [userId]
    );
    if (!rows.length) return res.status(404).json({ message: 'Company profile not found' });
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCompanyProfile = async (req, res) => {
  const userId = req.user.id;
  const { description, location } = req.body;
  try {
    await pool.query(
      `UPDATE companies SET description = ?, location = ? WHERE user_id = ?`,
      [description, location, userId]
    );
    res.json({ message: 'Company profile updated' });
  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createJob = async (req, res) => {
  const companyId = req.user.id;
  const { sector, salary, work_mode, work_time, tech_stack } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO jobs (company_id, sector, salary, work_mode, work_time, tech_stack)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [companyId, sector, salary, work_mode, work_time, JSON.stringify(tech_stack)]
    );
    res.status(201).json({ jobId: result.insertId });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listJobsByCompany = async (req, res) => {
  const companyId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM jobs WHERE company_id = ? ORDER BY created_at DESC`,
      [companyId]
    );
    const jobs = rows.map(job => ({
      ...job,
      tech_stack: JSON.parse(job.tech_stack)
    }));
    res.json(jobs);
  } catch (error) {
    console.error('Error listing company jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
