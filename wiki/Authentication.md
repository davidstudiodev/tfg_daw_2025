# Authentication & Security

## Overview

JobsXDevs uses **JWT tokens stored in HttpOnly cookies** for authentication. This approach protects tokens from XSS attacks since JavaScript cannot access HttpOnly cookies.

---

## Authentication Flow

```
┌─────────┐                    ┌─────────┐                    ┌─────────┐
│ Browser │                    │ Backend │                    │  MySQL  │
└────┬────┘                    └────┬────┘                    └────┬────┘
     │  POST /api/auth/login        │                              │
     │  { email, password }         │                              │
     │─────────────────────────────►│  SELECT * FROM users         │
     │                              │─────────────────────────────►│
     │                              │◄─────────────────────────────│
     │                              │  bcrypt.compare(password)    │
     │                              │  jwt.sign({ id, email, role })
     │  Set-Cookie: token=<JWT>     │                              │
     │  (HttpOnly, Secure, SameSite)│                              │
     │◄─────────────────────────────│                              │
     │                              │                              │
     │  GET /api/dev/profile        │                              │
     │  Cookie: token=<JWT>         │                              │
     │─────────────────────────────►│                              │
     │                              │  jwt.verify(token)           │
     │                              │  req.user = decoded          │
     │  200 { profile data }        │                              │
     │◄─────────────────────────────│                              │
```

---

## JWT Token

The JWT token payload contains:

```json
{
  "id": 5,
  "email": "user@example.com",
  "role": "dev",
  "iat": 1700000000,
  "exp": 1700086400
}
```

- **Expiration**: 24 hours (`1d`)
- **Secret**: Configured via `JWT_SECRET` environment variable
- **Algorithm**: HS256 (default)

---

## Cookie Configuration

```javascript
res.cookie('token', token, {
  httpOnly: true,    // Not accessible via JavaScript
  secure: true,      // Only sent over HTTPS
  sameSite: 'none',  // Allows cross-origin requests (frontend/backend on different domains)
  maxAge: 86400000   // 24 hours in milliseconds
});
```

---

## Middleware Chain

### `authMiddleware`

**File**: `backend/middlewares/auth.middleware.js`

Reads the JWT from `req.cookies.token`, verifies it, and sets `req.user` with the decoded payload. Returns `401` if the token is missing or invalid.

### `isAdmin`

**File**: `backend/middlewares/isAdmin.js`

Checks that `req.user.role === 'admin'`. Returns `403` if the user is not an admin. Must be used after `authMiddleware`.

### `validateRequest`

**File**: `backend/middlewares/validateRequest.js`

Runs after `express-validator` validation chains. If any validation errors exist, returns `400` with the error details. Otherwise, passes control to the next handler.

---

## Rate Limiting

The application uses `express-rate-limit` to prevent abuse on sensitive endpoints:

| Limiter | Endpoint | Window | Max Requests |
|---------|----------|--------|-------------|
| `registerLimiter` | `POST /auth/register` | 1 hour | 3 |
| `loginLimiter` | `POST /auth/login` | 1 minute | 10 |
| `applyLimiter` | `POST /offers/:id/apply` | 1 minute | 5 |
| `createJobLimiter` | `POST /company/jobs` | 1 hour | 5 |

When the limit is exceeded, a `429` response is returned with a Spanish-language message.

---

## Password Security

- Passwords are hashed with **bcryptjs** using a salt factor of 10.
- Plain-text passwords are never stored or logged.
- Password reset tokens are cryptographically random (32 bytes hex) with a 1-hour expiry.

---

## CORS Configuration

```javascript
app.use(cors({
  origin: 'https://www.jobsxdevs.com',
  credentials: true
}));
```

- `credentials: true` allows the browser to send cookies in cross-origin requests.
- In production, only `https://www.jobsxdevs.com` is allowed as an origin.

---

## Frontend Route Guards

The Vue Router uses `beforeEach` navigation guards to enforce role-based access:

1. **Protected routes** (with `meta.requiresAuth`): Calls `GET /api/auth/me` to verify the user's role. Redirects to login if unauthenticated or unauthorized.
2. **Login/Register routes**: If the user is already authenticated, redirects to their profile page.
3. **Admin login route**: If an admin is already logged in, redirects to the admin profile.
