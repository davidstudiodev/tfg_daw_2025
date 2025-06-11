import express from 'express'
import { body } from 'express-validator'
import validateRequest from '../middlewares/validateRequest.js'
import { sendContactMail } from '../controllers/contact.controller.js'

const router = express.Router()

router.post(
  '/',
  [
    body('name').isString().notEmpty(),
    body('email').isEmail(),
    body('message').isString().isLength({ min: 5 })
  ],
  validateRequest,
  sendContactMail
)

export default router