# SI Film Archive - Backend API

Backend API untuk aplikasi SI Film Archive menggunakan Fastify, Objection.js, dan Better Auth.

## Tech Stack

- **Fastify** - Web framework
- **Objection.js + Knex** - ORM dan query builder
- **MySQL** - Database
- **Better Auth** - Authentication (Email/Password + Google OAuth)
- **Groq/OpenAI/Gemini** - AI Provider (flexible)
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
├── lib/            # Utilities (auth, ai, helpers)
│   └── ai/         # AI providers (pluggable)
└── database/       # Migrations & seeds
```

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

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

# AI Provider (groq, openai, gemini)
AI_PROVIDER=groq
GROQ_API_KEY=your-groq-api-key
```

### 3. Setup Database

```sql
CREATE DATABASE si_film_archive;
```

```bash
npm run migrate
```

### 4. Run Server

```bash
npm run dev    # Development
npm start      # Production
```

---

## Role System

| role_id | name      | Deskripsi                           |
| ------- | --------- | ----------------------------------- |
| 1       | user      | Default - bisa vote dan comment     |
| 2       | creator   | Bisa upload dan manage film sendiri |
| 3       | moderator | Bisa moderasi komentar dan diskusi  |
| 4       | admin     | Full access ke semua fitur          |

---

## API Endpoints

Base URL: `http://localhost:3000/api`

### Health Check

```
GET /api/health
```

Response:

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-12-30T10:00:00.000Z"
}
```

---

## Authentication

Better Auth menangani semua auth endpoints di `/api/auth/*`

### Register

```
POST /api/auth/sign-up/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

Response:

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "role_id": 1
  },
  "session": {
    "token": "xxx"
  }
}
```

### Login

```
POST /api/auth/sign-in/email
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "role_id": 1
  },
  "session": {
    "token": "xxx"
  }
}
```

### Login dengan Google

```
GET /api/auth/sign-in/social?provider=google
```

Redirect ke Google OAuth flow.

### Logout

```
POST /api/auth/sign-out
Cookie: better-auth.session_token=xxx
```

### Get Session

```
GET /api/auth/session
Cookie: better-auth.session_token=xxx
```

### Forget Password

```
POST /api/auth/forget-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password

```
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "newPassword": "newpassword123"
}
```

---

## User Profile

### Get Profile

```
GET /api/auth/profile
Cookie: better-auth.session_token=xxx
```

Response:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "role": {
      "role_id": 1,
      "name": "user",
      "description": "Default user - can vote and comment"
    },
    "image": null,
    "email_verified": false,
    "created_at": "2024-12-30T10:00:00.000Z"
  }
}
```

### Get All Roles

```
GET /api/auth/roles
Cookie: better-auth.session_token=xxx
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "role_id": 1,
      "name": "user",
      "description": "Default user - can vote and comment"
    },
    {
      "role_id": 2,
      "name": "creator",
      "description": "Can upload and manage own films"
    },
    {
      "role_id": 3,
      "name": "moderator",
      "description": "Can moderate comments and discussions"
    },
    {
      "role_id": 4,
      "name": "admin",
      "description": "Full access to all features"
    }
  ]
}
```

### Get All Users (Admin)

```
GET /api/auth/users
Cookie: better-auth.session_token=xxx (admin)
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "John Doe",
      "role_id": 1,
      "role": { "role_id": 1, "name": "user" },
      "image": null,
      "created_at": "2024-12-30T10:00:00.000Z"
    }
  ]
}
```

### Update User Role (Admin)

```
PATCH /api/auth/users/:userId/role
Cookie: better-auth.session_token=xxx (admin)
Content-Type: application/json

{
  "role_id": 2
}
```

Response:

```json
{
  "success": true,
  "message": "Role updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "name": "John Doe",
    "role_id": 2,
    "role": { "role_id": 2, "name": "creator" }
  }
}
```

---

## Categories

### Get All Categories

```
GET /api/categories
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "nama_kategori": "Film Pendek",
      "deskripsi": "Film dengan durasi di bawah 30 menit",
      "created_at": "2024-12-30T10:00:00.000Z"
    },
    {
      "category_id": 2,
      "nama_kategori": "Dokumenter",
      "deskripsi": "Film dokumenter",
      "created_at": "2024-12-30T10:00:00.000Z"
    }
  ]
}
```

### Get Categories with Film Count

```
GET /api/categories/with-count
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "category_id": 1,
      "nama_kategori": "Film Pendek",
      "deskripsi": "Film dengan durasi di bawah 30 menit",
      "film_count": 15
    }
  ]
}
```

### Get Single Category

```
GET /api/categories/:id
```

Response:

```json
{
  "success": true,
  "data": {
    "category_id": 1,
    "nama_kategori": "Film Pendek",
    "deskripsi": "Film dengan durasi di bawah 30 menit"
  }
}
```

### Create Category (Admin)

```
POST /api/categories
Cookie: better-auth.session_token=xxx (admin)
Content-Type: application/json

{
  "nama_kategori": "Film Pendek",
  "deskripsi": "Film dengan durasi di bawah 30 menit"
}
```

Response:

```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "category_id": 1,
    "nama_kategori": "Film Pendek",
    "deskripsi": "Film dengan durasi di bawah 30 menit"
  }
}
```

### Update Category (Admin)

```
PUT /api/categories/:id
Cookie: better-auth.session_token=xxx (admin)
Content-Type: application/json

{
  "nama_kategori": "Film Pendek Updated",
  "deskripsi": "Deskripsi baru"
}
```

### Delete Category (Admin)

```
DELETE /api/categories/:id
Cookie: better-auth.session_token=xxx (admin)
```

Response:

```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

---

## Films

### Get All Films (Published)

```
GET /api/films?page=1&limit=10&category_id=1&search=pendek&sortBy=created_at&sortOrder=desc
```

Query Parameters:

- `page` - Halaman (default: 1)
- `limit` - Jumlah per halaman (default: 10)
- `category_id` - Filter by kategori
- `search` - Cari by judul
- `sortBy` - Field sorting (default: created_at)
- `sortOrder` - asc/desc (default: desc)

Response:

```json
{
  "success": true,
  "data": [
    {
      "film_id": 1,
      "judul": "Film Pendek Saya",
      "sinopsis": "Cerita tentang...",
      "tahun_karya": 2024,
      "gambar_poster": "/uploads/poster.jpg",
      "status": "published",
      "created_at": "2024-12-30T10:00:00.000Z",
      "creator": {
        "id": "xxx",
        "name": "John Doe",
        "image": null
      },
      "category": {
        "category_id": 1,
        "nama_kategori": "Film Pendek"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Get Latest Films

```
GET /api/films/latest?limit=10
```

### Get Single Film

```
GET /api/films/:id
```

Response:

```json
{
  "success": true,
  "data": {
    "film_id": 1,
    "user_id": "xxx",
    "category_id": 1,
    "judul": "Film Pendek Saya",
    "sinopsis": "Cerita tentang...",
    "tahun_karya": 2024,
    "link_video_utama": "https://youtube.com/watch?v=xxx",
    "link_trailer": "https://youtube.com/watch?v=yyy",
    "gambar_poster": "/uploads/poster.jpg",
    "deskripsi_lengkap": "Makna dari poster ini...",
    "file_naskah": "/uploads/naskah.pdf",
    "file_storyboard": "/uploads/storyboard.pdf",
    "file_rab": "/uploads/rab.pdf",
    "crew": [
      { "jabatan": "Sutradara", "anggota": ["John Doe"] },
      { "jabatan": "Penulis", "anggota": ["Jane Doe", "Bob"] }
    ],
    "status": "published",
    "created_at": "2024-12-30T10:00:00.000Z",
    "creator": {
      "id": "xxx",
      "name": "John Doe",
      "image": null
    },
    "category": {
      "category_id": 1,
      "nama_kategori": "Film Pendek"
    }
  }
}
```

### Get My Films (Creator)

```
GET /api/films/my-films?page=1&limit=10&status=pending
Cookie: better-auth.session_token=xxx (creator/admin)
```

### Create Film (Creator)

```
POST /api/films
Cookie: better-auth.session_token=xxx (creator/admin)
Content-Type: application/json

{
  "judul": "Film Pendek Saya",
  "category_id": 1,
  "sinopsis": "Cerita tentang...",
  "tahun_karya": 2024,
  "link_video_utama": "https://youtube.com/watch?v=xxx",
  "link_trailer": "https://youtube.com/watch?v=yyy",
  "gambar_poster": "/uploads/poster.jpg",
  "deskripsi_lengkap": "Makna dari poster ini...",
  "file_naskah": "/uploads/naskah.pdf",
  "file_storyboard": "/uploads/storyboard.pdf",
  "file_rab": "/uploads/rab.pdf",
  "crew": [
    { "jabatan": "Sutradara", "anggota": ["John Doe"] },
    { "jabatan": "Penulis", "anggota": ["Jane Doe", "Bob"] }
  ]
}
```

Response:

```json
{
  "success": true,
  "message": "Film created successfully. Waiting for admin approval.",
  "data": {
    "film_id": 1,
    "judul": "Film Pendek Saya",
    "status": "pending"
  }
}
```

### Update Film (Creator - own film)

```
PUT /api/films/:id
Cookie: better-auth.session_token=xxx
Content-Type: application/json

{
  "judul": "Film Pendek Saya (Updated)",
  "sinopsis": "Sinopsis baru..."
}
```

### Delete Film (Creator - own film)

```
DELETE /api/films/:id
Cookie: better-auth.session_token=xxx
```

### Get Pending Films (Admin)

```
GET /api/films/pending
Cookie: better-auth.session_token=xxx (admin)
```

### Approve Film (Admin)

```
PATCH /api/films/:id/approve
Cookie: better-auth.session_token=xxx (admin)
```

Response:

```json
{
  "success": true,
  "message": "Film approved and published",
  "data": {
    "film_id": 1,
    "status": "published"
  }
}
```

### Reject Film (Admin)

```
PATCH /api/films/:id/reject
Cookie: better-auth.session_token=xxx (admin)
```

---

## Votes (Trending System)

### Get Trending Films

```
GET /api/votes/trending?period=week&limit=10
```

Query Parameters:

- `period` - `week`, `month`, atau `all` (default: week)
- `limit` - Jumlah film (default: 10)

Response:

```json
{
  "success": true,
  "data": [
    {
      "film_id": 1,
      "judul": "Film Trending",
      "vote_count": 42,
      "creator": { "id": "xxx", "name": "John Doe" },
      "category": { "category_id": 1, "nama_kategori": "Film Pendek" }
    },
    {
      "film_id": 3,
      "judul": "Film Populer",
      "vote_count": 35
    }
  ]
}
```

### Get Vote Count for Film

```
GET /api/votes/film/:filmId
Cookie: better-auth.session_token=xxx (optional - untuk cek has_voted)
```

Response:

```json
{
  "success": true,
  "data": {
    "vote_count": 42,
    "has_voted": true
  }
}
```

### Vote Film

```
POST /api/votes/film/:filmId
Cookie: better-auth.session_token=xxx
```

Response:

```json
{
  "success": true,
  "message": "Vote recorded successfully",
  "data": {
    "vote_count": 43
  }
}
```

### Toggle Vote (Vote/Unvote)

```
POST /api/votes/film/:filmId/toggle
Cookie: better-auth.session_token=xxx
```

Response:

```json
{
  "success": true,
  "message": "Vote removed",
  "data": {
    "voted": false,
    "vote_count": 42
  }
}
```

### Unvote Film

```
DELETE /api/votes/film/:filmId
Cookie: better-auth.session_token=xxx
```

### Get My Votes

```
GET /api/votes/my-votes
Cookie: better-auth.session_token=xxx
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "vote_id": 1,
      "film_id": 1,
      "created_at": "2024-12-30T10:00:00.000Z",
      "film": {
        "film_id": 1,
        "judul": "Film yang saya vote"
      }
    }
  ]
}
```

---

## Discussions (Comments)

Menggunakan **Adjacency List** pattern untuk nested comments.

### Get Comments for Film (Nested Tree)

```
GET /api/discussions/film/:filmId?page=1&limit=20
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "diskusi_id": 1,
      "film_id": 1,
      "isi_pesan": "Film yang bagus!",
      "parent_id": null,
      "created_at": "2024-12-30T10:00:00.000Z",
      "user": {
        "id": "xxx",
        "name": "John Doe",
        "image": null
      },
      "reply_count": 2,
      "replies": [
        {
          "diskusi_id": 2,
          "isi_pesan": "Setuju banget!",
          "parent_id": 1,
          "depth": 1,
          "user": { "id": "yyy", "name": "Jane" },
          "replies": [
            {
              "diskusi_id": 3,
              "isi_pesan": "Iya bener",
              "parent_id": 2,
              "depth": 2,
              "replies": []
            }
          ]
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

### Get Comment Count

```
GET /api/discussions/film/:filmId/count
```

Response:

```json
{
  "success": true,
  "data": {
    "comment_count": 15
  }
}
```

### Post Comment

```
POST /api/discussions/film/:filmId
Cookie: better-auth.session_token=xxx
Content-Type: application/json

{
  "isi_pesan": "Film yang bagus!"
}
```

Response:

```json
{
  "success": true,
  "message": "Comment posted successfully",
  "data": {
    "diskusi_id": 1,
    "film_id": 1,
    "isi_pesan": "Film yang bagus!",
    "parent_id": null,
    "user": { "id": "xxx", "name": "John Doe" }
  }
}
```

### Reply to Comment

```
POST /api/discussions/film/:filmId
Cookie: better-auth.session_token=xxx
Content-Type: application/json

{
  "isi_pesan": "Setuju banget!",
  "parent_id": 1
}
```

Response:

```json
{
  "success": true,
  "message": "Reply posted successfully",
  "data": {
    "diskusi_id": 2,
    "isi_pesan": "Setuju banget!",
    "parent_id": 1
  }
}
```

### Update Comment (Owner only)

```
PUT /api/discussions/:id
Cookie: better-auth.session_token=xxx
Content-Type: application/json

{
  "isi_pesan": "Komentar yang sudah diedit"
}
```

### Delete Comment (Owner/Moderator/Admin)

```
DELETE /api/discussions/:id
Cookie: better-auth.session_token=xxx
```

Response:

```json
{
  "success": true,
  "message": "Comment deleted successfully"
}
```

### Get All Comments - Flat List (Moderator)

```
GET /api/discussions/all?page=1&limit=50&film_id=1
Cookie: better-auth.session_token=xxx (moderator/admin)
```

---

## AI Chat

### Send Message to AI

```
POST /api/chat
Cookie: better-auth.session_token=xxx
Content-Type: application/json

{
  "message": "Rekomendasikan film pendek Indonesia yang bagus"
}
```

Response:

```json
{
  "success": true,
  "data": {
    "chat_id": 1,
    "user_prompt": "Rekomendasikan film pendek Indonesia yang bagus",
    "ai_response": "Berikut beberapa rekomendasi film pendek Indonesia yang layak ditonton:\n\n1. **Prenjak** (2016) - Film pendek karya Wregas Bhanuteja...",
    "model": "llama-3.3-70b-versatile"
  }
}
```

### Get Chat History

```
GET /api/chat/history?page=1&limit=20
Cookie: better-auth.session_token=xxx
```

Response:

```json
{
  "success": true,
  "data": [
    {
      "chat_id": 1,
      "user_prompt": "Rekomendasikan film pendek",
      "ai_response": "Berikut rekomendasinya...",
      "created_at": "2024-12-30T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5,
    "totalPages": 1
  }
}
```

### Clear Chat History

```
DELETE /api/chat/history
Cookie: better-auth.session_token=xxx
```

### Delete Single Chat

```
DELETE /api/chat/:id
Cookie: better-auth.session_token=xxx
```

---

## Setup Google OAuth

### Step 1: Buat Project di Google Cloud Console

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Klik **Select a project** → **New Project**
3. Isi nama project: `SI Film Archive`
4. Klik **Create**

### Step 2: Enable API

1. Pilih **APIs & Services** → **Library**
2. Cari dan enable **Google+ API**

### Step 3: Setup OAuth Consent Screen

1. Pilih **APIs & Services** → **OAuth consent screen**
2. Pilih **External** → **Create**
3. Isi:
   - App name: `SI Film Archive`
   - User support email: email kamu
   - Developer contact: email kamu
4. Scopes: tambahkan `email`, `profile`, `openid`
5. Save and Continue

### Step 4: Buat OAuth Credentials

1. Pilih **APIs & Services** → **Credentials**
2. Klik **+ Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Isi:
   - Name: `SI Film Archive Web Client`
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     http://localhost:5173
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/callback/google
     ```
5. Copy **Client ID** dan **Client Secret** ke `.env`

---

## Setup AI Provider

### Groq (Recommended - Free)

1. Daftar di [console.groq.com](https://console.groq.com)
2. Buat API key
3. Update `.env`:
   ```env
   AI_PROVIDER=groq
   GROQ_API_KEY=gsk_xxxxx
   GROQ_MODEL=llama-3.3-70b-versatile
   ```

### OpenAI

```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxxxx
OPENAI_MODEL=gpt-4o-mini
```

### Google Gemini

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=xxxxx
GEMINI_MODEL=gemini-1.5-flash
```

---

## Error Responses

Semua error mengikuti format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

Common HTTP Status:

- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Scripts

| Command                    | Deskripsi                         |
| -------------------------- | --------------------------------- |
| `npm run dev`              | Development server dengan nodemon |
| `npm start`                | Production server                 |
| `npm run migrate`          | Jalankan migrations               |
| `npm run migrate:rollback` | Rollback migration terakhir       |
| `npm run seed`             | Jalankan seeds                    |

---

## Database Schema

### Tables

| Table           | Deskripsi                                     |
| --------------- | --------------------------------------------- |
| `roles`         | Daftar role (user, creator, moderator, admin) |
| `users`         | Data user dengan role_id                      |
| `sessions`      | Session management (Better Auth)              |
| `accounts`      | OAuth accounts (Better Auth)                  |
| `verifications` | Email verification tokens                     |
| `categories`    | Kategori film                                 |
| `films`         | Data film/karya                               |
| `discussions`   | Komentar dan diskusi (Adjacency List)         |
| `votes`         | Vote/like untuk trending                      |
| `chat_history`  | Riwayat chat AI                               |

### Relationships

```
roles (1) ──────< users (many)
users (1) ──────< films (many)
users (1) ──────< discussions (many)
users (1) ──────< votes (many)
users (1) ──────< chat_history (many)
categories (1) ─< films (many)
films (1) ──────< discussions (many)
films (1) ──────< votes (many)
discussions (1) < discussions (many) [self-referencing for replies]
```
