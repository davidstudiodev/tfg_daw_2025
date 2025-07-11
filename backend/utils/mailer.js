import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Función para enviar correos electrónicos
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // tu correo Gmail
    pass: process.env.EMAIL_PASS  // tu contraseña de aplicación
  }
});

// Configuración del transportador para enviar correos electrónicos
export async function sendMail({ to, subject, html }) {
  return transporter.sendMail({
    from: `"JobsXDevs" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}