# SI Film Archive - Backend API

Backend API untuk aplikasi SI Film Archive menggunakan Fastify, Objection.js, dan Better Auth.

## Tech Stack

- **Fastify** - Web framework
- **Objection.js + Knex** - ORM dan query builder
- **MySQL** - Database
- **Better Auth** - Authentication (Email/Password + Google OAuth)
- **JavaScript (ESM)** - Non-TypeScript

## Arsitektur

Menggunakan **Model-Service-Controller (MSC)** pattern:

```
src/
├── controllers/    # Handle request/response
├── services/       # Business logic
├── models/         # Objection.js models
├── routes/         # Route definitions
├── middlewares/    # Auth, validation
├── lib/            # Utilities (auth, helpers)
└── database/       # Migrations & seeds
```

## Fitur Authentication

### Better Auth Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/api/auth/sign-up/email` | Register dengan email/password |
| POST | `/api/auth/sign-in/email` | Login dengan email/password |
| GET | `/api/auth/sign-in/social?provider=google` | Login dengan Google |
| POST | `/api/auth/forget-password` | Request reset password |
| POST | `/api/auth/reset-password` | Reset password dengan token |
| POST | `/api/auth/sign-out` | Logout |
| GET | `/api/auth/session` | Get current session |

### Custom Endpoints

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| GET | `/api/auth/profile` | Required | Get user profile dengan role |
| GET | `/api/auth/roles` | Required | List semua roles |
| GET | `/api/auth/users` | Admin | List semua users |
| PATCH | `/api/auth/users/:userId/role` | Admin | Update role user |

## Role System

| role_id | name | Deskripsi |
|---------|------|-----------|
| 1 | user | Default - bisa vote dan comment |
| 2 | creator | Bisa upload dan manage film sendiri |
| 3 | moderator | Bisa moderasi komentar dan diskusi |
| 4 | admin | Full access ke semua fitur |

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

Copy `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Server
PORT=3000
HOST=0.0.0.0

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=si_film_archive

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-min-32-chars-long
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Database

Buat database MySQL:

```sql
CREATE DATABASE si_film_archive;
```

Jalankan migration:

```bash
npm run migrate
```

### 4. Run Server

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

---

## Setup Google OAuth

### Step 1: Buat Project di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik **Select a project** → **New Project**
3. Isi nama project (contoh: `SI Film Archive`)
4. Klik **Create**

### Step 2: Enable Google+ API

1. Di sidebar, pilih **APIs & Services** → **Library**
2. Cari **"Google+ API"** atau **"Google Identity"**
3. Klik dan **Enable**

### Step 3: Setup OAuth Consent Screen

1. Pilih **APIs & Services** → **OAuth consent screen**
2. Pilih **External** → **Create**
3. Isi form:
   - **App name**: SI Film Archive
   - **User support email**: email kamu
   - **Developer contact**: email kamu
4. Klik **Save and Continue**
5. Di **Scopes**, klik **Add or Remove Scopes**
   - Pilih: `email`, `profile`, `openid`
   - Klik **Update** → **Save and Continue**
6. Di **Test users**, tambahkan email untuk testing (optional untuk development)
7. Klik **Save and Continue** → **Back to Dashboard**

### Step 4: Buat OAuth Credentials

1. Pilih **APIs & Services** → **Credentials**
2. Klik **+ Create Credentials** → **OAuth client ID**
3. Pilih **Application type**: **Web application**
4. Isi:
   - **Name**: SI Film Archive Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     http://localhost:5173
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
5. Klik **Create**
6. Copy **Client ID** dan **Client Secret**

### Step 5: Update .env

```env
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxx
```

### Step 6: Test Google Login

Untuk login dengan Google dari frontend:

```javascript
// Redirect ke Google OAuth
window.location.href = 'http://localhost:3000/api/auth/sign-in/social?provider=google';
```

Atau gunakan Better Auth client:

```javascript
import { createAuthClient } from 'better-auth/client';

const authClient = createAuthClient({
  baseURL: 'http://localhost:3000/api/auth'
});

// Google Sign In
await authClient.signIn.social({ provider: 'google' });
```

---

## Contoh Request

### Register

```bash
curl -X POST http://localhost:3000/api/auth/sign-up/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/sign-in/email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Profile (dengan cookie session)

```bash
curl http://localhost:3000/api/auth/profile \
  -H "Cookie: better-auth.session_token=xxx"
```

### Update User Role (Admin only)

```bash
curl -X PATCH http://localhost:3000/api/auth/users/user-id-here/role \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=xxx" \
  -d '{"role_id": 2}'
```

---

## Scripts

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Run development server dengan nodemon |
| `npm start` | Run production server |
| `npm run migrate` | Jalankan database migrations |
| `npm run migrate:rollback` | Rollback migration terakhir |
| `npm run seed` | Jalankan database seeds |

## Database Schema

### Tables

- `roles` - Daftar role (user, creator, moderator, admin)
- `users` - Data user dengan role_id
- `sessions` - Session management (Better Auth)
- `accounts` - OAuth accounts (Better Auth)
- `verifications` - Email verification tokens
- `categories` - Kategori film
- `films` - Data film/karya
- `discussions` - Komentar dan diskusi
- `votes` - Vote/like untuk trending
- `chat_history` - Riwayat chat AI
