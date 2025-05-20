import { pool } from '../config/db.js';

export const getCompanyProfile = async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, c.avatar, c.location, c.phone, c.description
       FROM users u
       JOIN companies c ON c.user_id = u.id
       WHERE u.id = ?`,
      [userId]
    );
    if (!rows.length) return res.status(404).json({ message: 'Company profile not found' });

    // Asegura que avatar y phone nunca sean null
    const profile = rows[0];
    profile.avatar = profile.avatar || '';
    profile.phone = profile.phone || '';

    res.json(profile);
  } catch (error) {
    console.error('Error fetching company profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateCompanyProfile = async (req, res) => {
  const userId = req.user.id;
  const { name, email, avatar, location, phone, description } = req.body;
  try {
    // Actualiza también en users la info básica
    await pool.query(
      `UPDATE users SET name = ?, email = ? WHERE id = ?`,
      [name, email, userId]
    );
    await pool.query(
      `UPDATE companies SET avatar = ?, location = ?, phone = ?, description = ? WHERE user_id = ?`,
      [avatar || '', location, phone, description, userId]
    );
    res.json({ message: 'Company profile updated' });
  } catch (error) {
    console.error('Error updating company profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createJob = async (req, res) => {
  const companyId = req.user.id;
  const { description, sector, salary, work_mode, work_time, tech_stack } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO jobs (company_id, description, sector, salary, work_mode, work_time, tech_stack)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [companyId, description, sector, salary, work_mode, work_time, JSON.stringify(tech_stack)]
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

// Obtener todas las ofertas de la empresa
export const getCompanyJobs = async (req, res) => {
  const companyId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT * FROM jobs WHERE company_id = ? ORDER BY created_at DESC`,
      [companyId]
    );
    // Parsear tech_stack
    rows.forEach(job => {
      if (typeof job.tech_stack === 'string') {
        try { job.tech_stack = JSON.parse(job.tech_stack); } catch { job.tech_stack = []; }
      }
    });
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Actualizar oferta
export const updateJob = async (req, res) => {
  const companyId = req.user.id;
  const jobId = req.params.id;
  const { description, sector, salary, work_mode, work_time, tech_stack } = req.body;
  try {
    await pool.query(
      `UPDATE jobs SET description=?, sector=?, salary=?, work_mode=?, work_time=?, tech_stack=?
       WHERE id=? AND company_id=?`,
      [description, sector, salary, work_mode, work_time, JSON.stringify(tech_stack), jobId, companyId]
    );
    res.json({ message: 'Oferta actualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Eliminar oferta
export const deleteJob = async (req, res) => {
  const companyId = req.user.id;
  const jobId = req.params.id;
  try {
    await pool.query(
      `DELETE FROM jobs WHERE id=? AND company_id=?`,
      [jobId, companyId]
    );
    res.json({ message: 'Oferta eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
