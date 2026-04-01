# Getting Started

## Prerequisites

- **Node.js** v18 or higher
- **npm**
- **MySQL** v8 or higher

---

## 1. Clone the Repository

```bash
git clone https://github.com/davidstudiodev/tfg_daw_2025.git
cd tfg_daw_2025
```

---

## 2. Backend Setup

### Install dependencies

```bash
cd backend
npm install
```

### Configure environment variables

Create a `.env` file in `/backend`:

```env
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=jobsxdevs
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=http://localhost:5173
```

> **Note**: `EMAIL_PASS` must be a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your regular Gmail password.

### Initialize the database

```bash
mysql -u your_mysql_user -p < database/schema.sql
```

This creates the `jobsxdevs` database, all tables, and a default admin user.

### Start the backend

```bash
# Development (with auto-reload via nodemon)
npm run dev

# Production
npm start
```

The server will run on `http://localhost:3000`.

---

## 3. Frontend Setup

### Install dependencies

```bash
cd frontend
npm install
```

### Configure environment variables

Create a `.env` file in `/frontend`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Start the frontend

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 4. Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `davidstudiosco@gmail.com` | `David123` |

> The default admin user is created by `schema.sql`. Regular developer and company accounts can be registered through the app's registration page.

---

## Available Scripts

### Backend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with auto-reload (nodemon) |
| `npm start` | Start in production mode |

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
