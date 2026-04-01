# JobsXDevs - Wiki

Welcome to the **JobsXDevs** project wiki. JobsXDevs is a full-stack job platform that connects developers with companies, built as a TFG (Trabajo de Fin de Grado) for DAW 2025.

**Live site**: [www.jobsxdevs.com](https://www.jobsxdevs.com/)

---

## Table of Contents

| Page | Description |
|------|-------------|
| [Architecture Overview](./Architecture.md) | High-level system design, tech stack, and project structure |
| [Getting Started](./Getting-Started.md) | Installation, environment setup, and running the project locally |
| [Database Schema](./Database-Schema.md) | Tables, relationships, and ER diagram description |
| [API Reference](./API-Reference.md) | Complete REST API endpoint documentation |
| [Authentication & Security](./Authentication.md) | JWT flow, cookies, middleware, and rate limiting |
| [Frontend Guide](./Frontend.md) | Vue 3 architecture, routing, components, and services |
| [Deployment](./Deployment.md) | Production deployment on Vercel (frontend) and Railway (backend) |

---

## Quick Overview

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3, Vite, Vue Router, Axios, SASS |
| Backend | Node.js, Express 5, ES Modules |
| Database | MySQL 8+ |
| Auth | JWT (HttpOnly cookies), bcryptjs |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Vercel (frontend), Railway (backend + DB) |

---

## User Roles

JobsXDevs supports three distinct user roles:

| Role | Description |
|------|-------------|
| **Developer** (`dev`) | Can create a profile, browse offers, and apply to jobs |
| **Company** (`company`) | Can create a profile, publish job offers, and view applicants |
| **Admin** (`admin`) | Can manage all users and companies from an admin dashboard |
