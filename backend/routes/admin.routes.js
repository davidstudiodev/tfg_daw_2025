import express from 'express'
import authMiddleware from '../middlewares/auth.middleware.js'
import isAdmin from '../middlewares/isAdmin.js'
import { pool } from '../config/db.js'
import { body } from 'express-validator'
import validateRequest from '../middlewares/validateRequest.js'

const router = express.Router()

// Obtener todos los usuarios (developers y companies)
router.get('/users', authMiddleware, isAdmin, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, name, email, role, created_at FROM users')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message })
  }
})

// Obtener todos los datos de un developer
router.get('/users/:id', authMiddleware, isAdmin, async (req, res) => {
  const userId = req.params.id
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at,
              d.profession, d.phone, d.location, d.years_experience, d.description
       FROM users u
       LEFT JOIN developers d ON d.user_id = u.id
       WHERE u.id = ?`,
      [userId]
    )
    if (!rows.length) return res.status(404).json({ message: 'Usuario no encontrado' })
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message })
  }
})

// Editar developer con validación
router.put(
  '/users/:id',
  authMiddleware,
  isAdmin,
  [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('profession').optional().isString(),
    body('phone').optional().isString(),
    body('location').optional().isString(),
    body('years_experience').optional().isInt({ min: 0 }),
    body('description').optional().isString()
  ],
  validateRequest,
  async (req, res) => {
    const userId = req.params.id
    const {
      name,
      email,
      profession,
      phone,
      location,
      years_experience,
      description
    } = req.body

    try {
      await pool.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, userId]
      )
      await pool.query(
        `UPDATE developers SET profession = ?, phone = ?, location = ?, years_experience = ?, description = ?
         WHERE user_id = ?`,
        [profession, phone, location, years_experience, description, userId]
      )
      res.json({ message: 'Usuario actualizado correctamente' })
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar usuario', error: error.message })
    }
  }
)

// Eliminar un usuario
router.delete('/users/:id', authMiddleware, isAdmin, async (req, res) => {
  const userId = req.params.id
  try {
    // Elimina el usuario (y en cascada sus datos de developer/company/applications)
    await pool.query('DELETE FROM users WHERE id = ?', [userId])
    res.json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message })
  }
})

// Crear una nueva empresa
router.put(
  '/companies/:id',
  authMiddleware,
  isAdmin,
  [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('description').optional().isString(),
    body('location').optional().isString(),
    body('phone').optional().isString(),
    body('avatar').optional().isString()
  ],
  validateRequest,
  async (req, res) => {
    const companyId = req.params.id
    const { name, email, description, location, phone, avatar } = req.body

    try {
      await pool.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [name, email, companyId]
      )
      await pool.query(
        `UPDATE companies SET description = ?, location = ?, phone = ?, avatar = ? WHERE user_id = ?`,
        [description, location, phone, avatar, companyId]
      )
      res.json({ message: 'Empresa actualizada correctamente' })
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar empresa', error: error.message })
    }
  }
)

// Obtener todos los datos de una empresa
router.get('/companies/:id', authMiddleware, isAdmin, async (req, res) => {
  const companyId = req.params.id
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, u.role, u.created_at,
              c.description, c.location, c.phone, c.avatar
       FROM users u
       LEFT JOIN companies c ON c.user_id = u.id
       WHERE u.id = ?`,
      [companyId]
    )
    if (!rows.length) return res.status(404).json({ message: 'Empresa no encontrada' })
    res.json(rows[0])
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener empresa', error: error.message })
  }
})

// Eliminar una empresa
router.delete('/companies/:id', authMiddleware, isAdmin, async (req, res) => {
  const companyId = req.params.id
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [companyId])
    res.json({ message: 'Empresa eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar empresa', error: error.message })
  }
})

export default router