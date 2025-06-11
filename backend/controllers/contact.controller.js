import { sendMail } from '../utils/mailer.js'

export const sendContactMail = async (req, res) => {
  const { name, email, message } = req.body
  try {
    // Enviar el mensaje al correo de admin
    await sendMail({
      to: process.env.EMAIL_USER,
      subject: `Contacto desde JobsXDevs - ${name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${message}</p>
      `
    })

    // Enviar el mensaje de confirmación al usuario
    await sendMail({
      to: email,
      subject: 'Gracias por contactarnos - JobsXDevs',
      html: `
        <h2>¡Gracias por escribirnos, ${name}!</h2>
        <p>Nos pondremos en contacto pronto.</p>
        <hr>
        <p style="font-size:13px;color:#888;">Este es un mensaje automático, por favor no respondas a este correo.</p>
      `
    })

    res.json({ message: 'Mensaje enviado correctamente.' })
  } catch (error) {
    res.status(500).json({ message: 'No se pudo enviar el mensaje.', error: error.message })
  }
}