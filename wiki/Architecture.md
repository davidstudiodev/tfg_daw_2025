# Architecture Overview

## Tech Stack

```
┌─────────────────────────────────────────────────────┐
│                     Frontend                        │
│         Vue 3 + Vite + Vue Router + Axios           │
│         Deployed on Vercel                          │
└──────────────────────┬──────────────────────────────┘
                       │  HTTPS (cookies)
                       ▼
┌─────────────────────────────────────────────────────┐
│                     Backend                         │
│         Node.js + Express 5 (ES Modules)            │
│         Deployed on Railway                         │
└──────────────────────┬──────────────────────────────┘
                       │  mysql2/promise
                       ▼
┌─────────────────────────────────────────────────────┐
│                    Database                         │
│                  MySQL 8+                           │
│              Hosted on Railway                      │
└─────────────────────────────────────────────────────┘
```

## Project Structure

```
tfg_daw_2025/
├── backend/
│   ├── config/           # Database connection (MySQL pool)
│   ├── controllers/      # Business logic per resource
│   │   ├── auth.controller.js
│   │   ├── company.controller.js
│   │   ├── contact.controller.js
│   │   ├── dev.controller.js
│   │   └── offers.controller.js
│   ├── database/         # SQL schema file
│   │   └── schema.sql
│   ├── middlewares/      # Auth, validation, rate limiting
│   │   ├── auth.middleware.js
│   │   ├── isAdmin.js
│   │   ├── rateLimiters.js
│   │   └── validateRequest.js
│   ├── models/           # Data access layer
│   │   ├── Application.js
│   │   └── User.js
│   ├── routes/           # Express route definitions
│   │   ├── admin.routes.js
│   │   ├── auth.routes.js
│   │   ├── company.routes.js
│   │   ├── contact.routes.js
│   │   ├── dev.routes.js
│   │   ├── offers.routes.js
│   │   └── protected.routes.js
│   ├── utils/            # Helpers (email sender)
│   │   └── mailer.js
│   ├── index.js          # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── router/           # Vue Router configuration
│   │   └── index.js
│   ├── src/
│   │   ├── assets/       # Static resources (images, styles)
│   │   ├── components/   # Reusable Vue components
│   │   ├── constants/    # Global constants (techOptions)
│   │   ├── services/     # API client layer (Axios)
│   │   ├── views/        # Page-level Vue components
│   │   ├── App.vue       # Root component
│   │   ├── main.js       # Application entry point
│   │   └── style.css     # Global styles
│   ├── public/           # Static public files
│   ├── vite.config.js    # Vite config with dev proxy
│   ├── vercel.json       # Vercel deployment config
│   └── package.json
│
├── Memoria_TFG.pdf       # Project report / thesis document
└── proyecto_tfg.txt      # Project links and credentials
```

## Design Patterns

### Backend
- **MVC-like pattern**: Routes define HTTP endpoints, controllers contain business logic, and models handle database queries.
- **Middleware pipeline**: Express middlewares handle authentication, validation, rate limiting, and admin authorization in a composable chain.
- **Connection pooling**: MySQL connections are managed through a shared pool (`mysql2/promise`) for efficient resource usage.

### Frontend
- **SPA with client-side routing**: Vue Router manages navigation with route guards for authentication and role-based access.
- **Service layer**: All API calls are abstracted into service modules (`auth.js`, `profile.js`) using a centralized Axios instance.
- **Component composition**: Reusable components (e.g., `TopDevelopers`, `TopCompanies`, `SkillsShowcase`) compose the views.

## Communication Flow

1. The frontend makes API calls to `/api/*` endpoints via Axios (with `withCredentials: true`).
2. In development, Vite proxies `/api` requests to `http://localhost:3000`.
3. In production, the frontend at `jobsxdevs.com` communicates directly with the Railway-hosted backend.
4. Authentication uses **HttpOnly cookies** containing a JWT token, set by the backend on login and cleared on logout.
