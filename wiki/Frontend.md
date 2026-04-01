# Frontend Guide

The frontend is a **Single Page Application (SPA)** built with Vue 3, Vite, and Vue Router.

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Vue 3** | UI framework (Composition API compatible) |
| **Vite** | Build tool and dev server |
| **Vue Router** | Client-side routing with navigation guards |
| **Axios** | HTTP client for API calls |
| **vue-toastification** | Toast notifications |
| **material-icons** | Icon library |
| **sass-embedded** | SCSS/SASS styling |
| **jwt-decode** | JWT token decoding on the client side |

---

## Project Structure

```
frontend/
├── router/
│   └── index.js              # Route definitions and navigation guards
├── src/
│   ├── assets/               # Images, fonts, static styles
│   ├── components/           # Reusable UI components
│   │   ├── AppLogo.vue       # Application logo
│   │   ├── CompanyStats.vue  # Company statistics display
│   │   ├── CompanyWhyUs.vue  # "Why choose us" section
│   │   ├── Footer.vue        # Page footer
│   │   ├── SkillsShowcase.vue # Tech skills display
│   │   ├── TopCompanies.vue  # Featured companies carousel
│   │   ├── TopDevelopers.vue # Featured developers carousel
│   │   └── TopTech.vue       # Popular technologies display
│   ├── constants/
│   │   └── techOptions.js    # Available tech stack categories
│   ├── services/             # API communication layer
│   │   ├── api.js            # Axios instance configuration
│   │   ├── auth.js           # Authentication API calls
│   │   └── profile.js        # Profile and job API calls
│   ├── views/                # Page-level components
│   │   ├── Home.vue          # Landing page
│   │   ├── Login.vue         # Login form
│   │   ├── Register.vue      # Registration form
│   │   ├── DevProfile.vue    # Developer dashboard/profile
│   │   ├── CompanyProfile.vue # Company dashboard/profile
│   │   ├── Offers.vue        # Public job listing
│   │   ├── Developers.vue    # Public developer directory
│   │   ├── AdminLogin.vue    # Admin login page
│   │   ├── AdminProfile.vue  # Admin dashboard
│   │   ├── ResetPassword.vue # Password reset form
│   │   └── NotFound.vue      # 404 page
│   ├── App.vue               # Root component
│   ├── main.js               # App initialization
│   └── style.css             # Global styles
├── public/                   # Static files (favicon, etc.)
├── vite.config.js            # Vite configuration
├── vercel.json               # Vercel deployment config
└── package.json
```

---

## Routes

| Path | Component | Auth Required | Role | Description |
|------|-----------|--------------|------|-------------|
| `/` | `Home` | No | - | Landing page |
| `/login` | `Login` | No | - | Login (redirects if authenticated) |
| `/register` | `Register` | No | - | Registration form |
| `/dev/profile` | `DevProfile` | Yes | `dev` | Developer dashboard |
| `/company/profile` | `CompanyProfile` | Yes | `company` | Company dashboard |
| `/offers` | `Offers` | No | - | Public job listings |
| `/developers` | `Developers` | No | - | Public developer directory |
| `/admin` | `AdminLogin` | No | - | Admin login page |
| `/admin/profile` | `AdminProfile` | Yes | `admin` | Admin dashboard |
| `/reset-password` | `ResetPassword` | No | - | Password reset form |
| `/:pathMatch(.*)*` | `NotFound` | No | - | 404 catch-all |

### Route Props

- `/login?role=dev` and `/register?role=dev`: The `role` query parameter is passed as a prop to pre-select the role.

---

## Services Layer

### `api.js`

Creates a centralized Axios instance with:
- `baseURL` from `VITE_API_URL` environment variable
- `withCredentials: true` to include cookies in all requests

### `auth.js`

| Function | Method | Endpoint |
|----------|--------|----------|
| `register(data)` | POST | `/api/auth/register` |
| `login(creds)` | POST | `/api/auth/login` |
| `getMe()` | GET | `/api/auth/me` |
| `logout()` | POST | `/api/auth/logout` |
| `forgotPassword(email)` | POST | `/api/auth/forgot-password` |

### `profile.js`

| Function | Method | Endpoint |
|----------|--------|----------|
| `getDevProfile()` | GET | `/api/dev/profile` |
| `updateDevProfile(data)` | PUT | `/api/dev/profile` |
| `getCompanyProfile()` | GET | `/api/company/profile` |
| `updateCompanyProfile(data)` | PUT | `/api/company/profile` |
| `createJob(data)` | POST | `/api/company/jobs` |
| `getCompanyJobs()` | GET | `/api/company/jobs` |
| `updateJob(id, data)` | PUT | `/api/company/jobs/:id` |
| `deleteJob(id)` | DELETE | `/api/company/jobs/:id` |

---

## Tech Stack Options

The app provides predefined technology categories for developer profiles and job offers:

| Category | Technologies |
|----------|-------------|
| Frontend | HTML, CSS, JavaScript, Vue, Angular, React, Astro |
| Backend | Node, Python, Java, PHP, Laravel, Express, Django, Spring Boot, Flask |
| Base de datos | MySQL, MongoDB, SQLite, PostgreSQL, Redis |
| DevOps / Cloud | Docker, Kubernetes, AWS, Azure, GitHub |
| Ciberseguridad | Burp Suite, Nmap, Wireshark, OWASP Zap |
| Herramientas | Git, VS Code, Webpack, Vite, ESLint |

---

## Dev Proxy

During development, Vite proxies API requests to avoid CORS issues:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      secure: false
    }
  }
}
```

This means all requests to `/api/*` from the frontend are forwarded to the backend at `localhost:3000`.
