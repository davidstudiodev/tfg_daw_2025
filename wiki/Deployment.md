# Deployment

JobsXDevs is deployed with the frontend on **Vercel** and the backend + database on **Railway**.

---

## Production URLs

| Service | URL |
|---------|-----|
| Frontend | [https://www.jobsxdevs.com](https://www.jobsxdevs.com/) |
| Frontend (Vercel) | [https://tfg-daw-2025.vercel.app](https://tfg-daw-2025.vercel.app) |
| Backend (Railway) | [https://tfgdaw2025-production.up.railway.app](https://tfgdaw2025-production.up.railway.app) |

---

## Frontend Deployment (Vercel)

The frontend is configured for Vercel deployment via `vercel.json`.

### Build Command

```bash
cd frontend
npm run build
```

This produces a `dist/` folder with the production build.

### Environment Variables (Vercel)

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | `https://tfgdaw2025-production.up.railway.app/api` |

### SPA Routing

Since the app uses Vue Router with `createWebHistory()` (HTML5 history mode), the `vercel.json` likely includes a rewrite rule to serve `index.html` for all routes, enabling client-side routing.

---

## Backend Deployment (Railway)

The backend runs on Railway with a MySQL database instance.

### Start Command

```bash
npm start
```

This runs `node index.js` to start the Express server.

### Environment Variables (Railway)

| Variable | Description |
|----------|-------------|
| `PORT` | Port assigned by Railway |
| `DB_HOST` | MySQL host (Railway internal) |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | `jobsxdevs` |
| `JWT_SECRET` | Secret key for signing JWTs |
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_PASS` | Gmail app password |
| `FRONTEND_URL` | `https://www.jobsxdevs.com` |

---

## CORS in Production

The backend CORS configuration restricts the allowed origin to the production frontend domain:

```javascript
app.use(cors({
  origin: 'https://www.jobsxdevs.com',
  credentials: true
}));
```

> **Important**: If you deploy the frontend to a different domain, update this origin accordingly.

---

## Database

The MySQL database is hosted on Railway. The schema can be initialized using the `backend/database/schema.sql` file.

To connect to the Railway database locally for debugging, use the connection details from the Railway dashboard.

---

## Figma Design

The application's UI was designed in Figma:

- **Design file**: [Figma Project](https://www.figma.com/design/hbXdLRL5ReWpUFslmXEkUP/TFG)
- **Interactive prototype**: [Figma Prototype](https://www.figma.com/proto/hbXdLRL5ReWpUFslmXEkUP/TFG?page-id=2%3A2&node-id=28-6677)
