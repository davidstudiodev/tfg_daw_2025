import { pool } from '../config/db.js';
import { createApplication, hasApplied } from '../models/Application.js';
import { sendMail } from '../utils/mailer.js';

// Obtener todas las ofertas paginadas y con datos de la empresa
export const listOffers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const offset = (page - 1) * limit;

  // Filtros
  const filters = [];
  const params = [];

  if (req.query.location) {
    filters.push('c.location LIKE ?');
    params.push(`%${req.query.location}%`);
  }
  if (req.query.work_time) {
    filters.push('j.work_time = ?');
    params.push(req.query.work_time);
  }
  if (req.query.salaryMin) {
    filters.push('j.salary >= ?');
    params.push(Number(req.query.salaryMin));
  }
  if (req.query.salaryMax) {
    filters.push('j.salary <= ?');
    params.push(Number(req.query.salaryMax));
  }

  let where = filters.length ? 'WHERE ' + filters.join(' AND ') : '';
  let order = 'ORDER BY j.salary DESC';
  if (req.query.salaryOrder === 'asc') order = 'ORDER BY j.salary ASC';

  try {
    const [offers] = await pool.query(
      `SELECT j.id, j.puesto, j.sector, j.salary, j.work_mode, j.work_time, j.tech_stack, j.created_at,
              u.name as company_name, c.avatar as company_avatar, c.location as company_location
       FROM jobs j
       JOIN companies c ON j.company_id = c.user_id
       JOIN users u ON c.user_id = u.id
       ${where}
       ${order}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    // Verifica y parsea tech_stack
    offers.forEach(offer => {
      if (typeof offer.tech_stack === 'string') {
        try { offer.tech_stack = JSON.parse(offer.tech_stack); } catch { offer.tech_stack = []; }
      }
    });
    // Total para paginación
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total
       FROM jobs j
       JOIN companies c ON j.company_id = c.user_id
       JOIN users u ON c.user_id = u.id
       ${where}`,
      params
    );
    res.json({ offers, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error('Error fetching offers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Aplicar a una oferta
export const applyToOffer = async (req, res) => {
  const devId = req.user.id;
  const offerId = req.params.id;
  try {
    // Verifica si ya aplicó
    if (await hasApplied({ offerId, devId })) {
      return res.status(400).json({ message: 'Ya has aplicado a esta oferta.' });
    }
    // Crea la aplicación
    await createApplication({ offerId, devId });
    // Obtener datos de la oferta y del dev
    const [[offer]] = await pool.query(
      `SELECT j.puesto, j.sector, j.salary, j.work_mode, j.work_time, j.tech_stack, u.name as company_name
       FROM jobs j JOIN companies c ON j.company_id = c.user_id JOIN users u ON c.user_id = u.id WHERE j.id = ?`,
      [offerId]
    );
    const [[dev]] = await pool.query(
      `SELECT u.email, u.name FROM users u WHERE u.id = ?`,
      [devId]
    );
    // Enviar email al dev
    await sendMail({
      to: dev.email,
      subject: 'Gracias por aplicar a una oferta',
      html: `<h1>¡Hola ${dev.name}!</h1><p>Gracias por aplicar a la oferta de ${offer.company_name}.</p><p><strong>Puesto:</strong> ${offer.puesto}</p><p><strong>Salario:</strong> ${offer.salary}</p>`
    });
    // (Opcional) Enviar email a la empresa
    const [[company]] = await pool.query(
      `SELECT u.email, u.name FROM users u JOIN companies c ON u.id = c.user_id WHERE c.user_id = (SELECT company_id FROM jobs WHERE id = ?)`,
      [offerId]
    );
    if (company) {
      await sendMail({
        to: company.email,
        subject: 'Nuevo candidato para tu oferta',
        html: `<h1>¡Hola ${company.name}!</h1><p>Un desarrollador ha aplicado a tu oferta: <strong>${offer.puesto}</strong>.</p><p>Revisa tu panel para más detalles.</p>`
      });
    }
    res.json({ message: 'Has aplicado correctamente y te contactaremos pronto.' });
  } catch (error) {
    console.error('Error al aplicar a la oferta:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
