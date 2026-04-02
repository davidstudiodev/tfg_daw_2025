# API Reference

Base URL: `https://tfgdaw2025-production.up.railway.app/api` (production) or `http://localhost:3000/api` (development)

All responses are in JSON format. Authentication is handled via HttpOnly cookies (see [Authentication](./Authentication.md)).

---

## Authentication (`/api/auth`)

### `POST /auth/register`

Register a new user (developer or company).

**Rate limit**: 3 requests per hour per IP.

**Request body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass",
  "role": "dev"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name |
| `email` | string | Yes | Unique email |
| `password` | string | Yes | Plain-text password (hashed server-side) |
| `role` | string | Yes | `"dev"` or `"company"` |

**Response** `201`:
```json
{ "message": "User created", "userId": 5 }
```

**Side effects**: Creates a profile row in `developers` or `companies`, sends a welcome email.

---

### `POST /auth/login`

Authenticate a user and set a session cookie.

**Rate limit**: 10 requests per minute per IP.

**Request body**:
```json
{
  "email": "john@example.com",
  "password": "securepass"
}
```

**Response** `200`:
```json
{ "message": "Login exitoso" }
```

**Side effects**: Sets an `HttpOnly` cookie named `token` containing a JWT (expires in 24 hours).

---

### `GET /auth/me`

Get the currently authenticated user's basic info.

**Auth**: Required (cookie).

**Response** `200`:
```json
{
  "id": 5,
  "email": "john@example.com",
  "role": "dev"
}
```

---

### `POST /auth/logout`

Log out the current user by clearing the session cookie.

**Auth**: Required.

**Response** `200`:
```json
{ "message": "Logged out" }
```

---

### `PUT /auth/change-password`

Change the authenticated user's password.

**Auth**: Required.

**Request body**:
```json
{
  "currentPassword": "oldpass",
  "newPassword": "newpass123"
}
```

| Field | Type | Validation |
|-------|------|------------|
| `currentPassword` | string | Not empty |
| `newPassword` | string | Min 6 characters |

---

### `POST /auth/forgot-password`

Request a password reset email.

**Request body**:
```json
{ "email": "john@example.com" }
```

**Response** `200`:
```json
{ "message": "Si el email existe, se enviara un enlace." }
```

**Side effects**: Generates a reset token (valid 1 hour), stores it in `password_resets`, and emails a reset link.

---

### `POST /auth/reset-password`

Reset password using a token from the email.

**Request body**:
```json
{
  "token": "abc123...",
  "newPassword": "newpass123"
}
```

---

### `PUT /auth/change-email`

Change the authenticated user's email address.

**Auth**: Required.

**Request body**:
```json
{
  "email": "newemail@example.com",
  "currentPassword": "mypassword"
}
```

---

## Developer Profiles (`/api/dev`)

### `GET /dev/profile`

Get the authenticated developer's full profile.

**Auth**: Required (role: `dev`).

**Response** `200`:
```json
{
  "id": 5,
  "name": "John Doe",
  "email": "john@example.com",
  "profession": "Full Stack Developer",
  "phone": "+34 612345678",
  "description": "Passionate about web development...",
  "years_experience": 3,
  "location": "Madrid",
  "tech_stack": [
    { "category": "Frontend", "items": ["Vue", "React"] },
    { "category": "Backend", "items": ["Node", "Express"] }
  ],
  "avatar": ""
}
```

---

### `PUT /dev/profile`

Update the authenticated developer's profile.

**Auth**: Required (role: `dev`).

**Request body**:

| Field | Type | Validation |
|-------|------|------------|
| `name` | string | Not empty |
| `email` | string | Valid email |
| `profession` | string | Not empty |
| `phone` | string | Not empty |
| `description` | string | Min 10 characters |
| `years_experience` | integer | Min 0 |
| `location` | string | Not empty |
| `tech_stack` | array | Array of `{category: string, items: string[]}` |
| `avatar` | string | Optional, base64 |

---

### `GET /dev/applications`

List all job applications made by the authenticated developer.

**Auth**: Required (role: `dev`).

**Response** `200`: Array of applications with job and company details.

---

### `DELETE /dev/applications/:id`

Delete a specific application.

**Auth**: Required (role: `dev`). Only the applicant can delete their own application.

---

### `GET /dev/all`

List all developers (public, paginated).

**Query parameters**:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 6 | Results per page |
| `name` | string | | Filter by name (LIKE) |
| `profession` | string | | Filter by profession (LIKE) |
| `location` | string | | Filter by location (LIKE) |

**Response** `200`:
```json
{
  "developers": [...],
  "total": 25,
  "page": 1,
  "totalPages": 5
}
```

---

## Company Profiles (`/api/company`)

### `GET /company/profile`

Get the authenticated company's profile.

**Auth**: Required (role: `company`).

---

### `PUT /company/profile`

Update the authenticated company's profile.

**Auth**: Required (role: `company`).

| Field | Type | Validation |
|-------|------|------------|
| `name` | string | Not empty |
| `email` | string | Valid email |
| `avatar` | string | Optional |
| `location` | string | Not empty |
| `phone` | string | Not empty |
| `description` | string | Max 50 characters |

---

### `POST /company/jobs`

Create a new job offer.

**Auth**: Required (role: `company`). **Rate limit**: 5 per hour.

| Field | Type | Validation |
|-------|------|------------|
| `position` | string | Max 20 characters |
| `sector` | string | Not empty |
| `salary` | number | Numeric |
| `work_mode` | string | `"remoto"`, `"hibrido"`, or `"local"` |
| `work_time` | string | `"completa"`, `"parcial"`, or `"practicas"` |
| `tech_stack` | array | Array of strings |

**Side effects**: Sends a confirmation email to the company.

---

### `GET /company/jobs`

List all jobs created by the authenticated company.

**Auth**: Required (role: `company`).

---

### `PUT /company/jobs/:id`

Update a specific job offer.

**Auth**: Required (role: `company`). Only the owner company can update.

---

### `DELETE /company/jobs/:id`

Delete a specific job offer.

**Auth**: Required (role: `company`). Only the owner company can delete.

---

### `GET /company/applications`

View all developer applications to the company's offers.

**Auth**: Required (role: `company`).

---

## Public Offers (`/api/offers`)

### `GET /offers`

List all published job offers (public, paginated).

**Query parameters**:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 6 | Results per page |
| `location` | string | | Filter by company location |
| `work_time` | string | | `"completa"`, `"parcial"`, or `"practicas"` |
| `salaryMin` | number | | Minimum salary |
| `salaryMax` | number | | Maximum salary |
| `salaryOrder` | string | `desc` | `"asc"` or `"desc"` |

**Response** `200`:
```json
{
  "offers": [...],
  "total": 42,
  "page": 1,
  "pages": 7
}
```

---

### `POST /offers/:id/apply`

Apply to a job offer as a developer.

**Auth**: Required (role: `dev`). **Rate limit**: 5 per minute.

**Side effects**: Sends confirmation emails to both the developer and the company.

---

## Contact (`/api/contact`)

### `POST /contact`

Send a contact message.

**Request body**:

| Field | Type | Validation |
|-------|------|------------|
| `name` | string | Not empty |
| `email` | string | Valid email |
| `message` | string | Min 5 characters |

**Side effects**: Sends the message to the admin email and a confirmation to the sender.

---

## Admin (`/api/admin`)

All admin endpoints require authentication + admin role.

### `GET /admin/users`
List all users (id, name, email, role, created_at).

### `GET /admin/users/:id`
Get full details of a developer user (joined with `developers` table).

### `PUT /admin/users/:id`
Edit a developer user's data (name, email, profession, phone, location, experience, description).

### `DELETE /admin/users/:id`
Delete a user and all associated data (cascades).

### `GET /admin/companies/:id`
Get full details of a company (joined with `companies` table).

### `PUT /admin/companies/:id`
Edit a company's data (name, email, description, location, phone, avatar).

### `DELETE /admin/companies/:id`
Delete a company user and all associated data.

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "message": "Human-readable error message"
}
```

Validation errors (from `express-validator`):

```json
{
  "errors": [
    { "msg": "Invalid value", "param": "email", "location": "body" }
  ]
}
```

Common HTTP status codes:

| Code | Meaning |
|------|---------|
| `400` | Bad request / validation error / duplicate entry |
| `401` | Not authenticated or token expired |
| `403` | Forbidden (admin-only route) |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `500` | Server error |
