# JobsXDevs - Backend

Este es el backend de JobsXDevs, una plataforma para la gestión de ofertas de empleo y perfiles de desarrolladores y empresas. Está desarrollado con Node.js, Express y MySQL.

---

## Índice

- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración](#instalación-y-configuración)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Base de datos](#base-de-datos)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Endpoints principales](#endpoints-principales)
- [Notas adicionales](#notas-adicionales)
- [Contacto](#contacto)

---

## Requisitos previos

- Node.js (v18 o superior recomendado)
- MySQL (v8 o superior recomendado)
- npm

---

## Instalación y configuración

1. **Clona el repositorio y accede a la carpeta del backend:**

   ```bash
   git clone https://github.com/tuusuario/jobsxdevs.git
   cd jobsxdevs/backend
   ```

2. **Instala las dependencias:**

   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**

   Crea un archivo `.env` en la raíz de `/backend` con el siguiente contenido (ajusta los valores según tu entorno):

   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=tu_usuario_mysql
   DB_PASSWORD=tu_contraseña_mysql
   DB_NAME=jobsxdevs
   JWT_SECRET=un_secreto_seguro
   EMAIL_USER=tu_email@gmail.com
   EMAIL_PASS=tu_contraseña_app_gmail
   ```

4. **Crea la base de datos:**

   - Importa el archivo de estructura SQL:

     ```bash
     mysql -u tu_usuario_mysql -p < database/schema.sql
     ```

   - Esto creará la base de datos, las tablas y un usuario administrador por defecto.

5. **Inicia el servidor:**

   - En desarrollo (con recarga automática):

     ```bash
     npm run dev
     ```

   - En producción:

     ```bash
     npm start
     ```

---

## Estructura del proyecto

```
backend/
│
├── config/           # Configuración de la base de datos y otros servicios
├── controllers/      # Lógica de negocio de cada recurso
├── database/         # Archivos SQL para la base de datos
│   └── schema.sql
├── middlewares/      # Middlewares de autenticación, validación, etc.
├── models/           # Modelos de acceso a datos
├── routes/           # Definición de rutas de la API
├── utils/            # Utilidades (envío de emails, helpers, etc.)
├── index.js          # Punto de entrada del servidor Express
└── .env              # Variables de entorno (no subir al repositorio)
```

---

## Base de datos

- El archivo `database/schema.sql` contiene toda la estructura necesaria para crear la base de datos y las tablas.
- Incluye un usuario administrador por defecto:
  - **Email:** admin@jobsxdevs
  - **Contraseña:** admin123 (encriptada, cámbiala tras el primer login)

---

## Variables de entorno

Asegúrate de configurar correctamente el archivo `.env` con los siguientes valores:

```
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=jobsxdevs
JWT_SECRET=un_secreto_seguro

EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_app_gmail
```

---

## Scripts disponibles

- `npm run dev`  
  Inicia el servidor en modo desarrollo con recarga automática (nodemon).
- `npm start`  
  Inicia el servidor en modo producción.

---

## Endpoints principales

- **Autenticación:** `/api/auth/*`
- **Desarrolladores:** `/api/dev/*`
- **Empresas:** `/api/company/*`
- **Ofertas:** `/api/offers/*`
- **Administración:** `/api/admin/*`

La API responde en formato JSON y utiliza cookies HttpOnly para la autenticación.

---

## Notas adicionales

- El backend utiliza middlewares para validación de datos, autenticación y autorización.
- El envío de emails requiere una cuenta de Gmail y una contraseña de aplicación (consulta la documentación de [Nodemailer](https://nodemailer.com/) para más detalles).
- El sistema de logs utiliza `morgan` para registrar las peticiones y errores.
- Si tienes dudas sobre la estructura de la base de datos, revisa el archivo `schema.sql`.

---

## Contacto

Para cualquier duda, sugerencia o reporte de errores, puedes abrir una issue en el repositorio o contactar al autor.

---