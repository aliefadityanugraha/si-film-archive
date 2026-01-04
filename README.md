# CineArchive

Platform kearsipan film mahasiswa untuk apresiasi, dokumentasi, dan pembelajaran karya sinematik. Aplikasi ini menggunakan arsitektur Monorepo yang terdiri dari Frontend (Vue 3) dan Backend (Fastify).

## Tech Stack

### Frontend (`si-film-archive/`)
- **Framework:** Vue 3 (Composition API `<script setup>`)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS (Custom Brutal Design System)
- **UI Components:** shadcn/ui Vue
- **Icons:** Lucide Vue
- **State Management:** Vue Composables
- **Routing:** Vue Router

### Backend (`backend/`)
- **Framework:** Fastify
- **Language:** JavaScript (Node.js)
- **Database:** MySQL
- **ORM/Query Builder:** Objection.js & Knex
- **Authentication:** Better Auth
- **File Handling:** @fastify/multipart

## Project Structure

```
.
├── backend/                # Server-side code (API)
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models (Objection.js)
│   │   ├── routes/         # API routes definition
│   │   └── database/       # Migrations & Seeds
│   └── ...
│
├── si-film-archive/        # Client-side code (Frontend)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application views/pages
│   │   ├── composables/    # Shared state & logic
│   │   └── lib/            # Utilities (API wrapper, etc.)
│   └── ...
└── README.md               # Documentation
```

## Features

- **Authentication & Authorization**: Login, Register, dan Role-Based Access Control (User, Creator, Moderator, Admin).
- **Film Archive**: Katalog film, pencarian, filter kategori, dan halaman detail film.
- **Learning Assets**: Akses ke aset pembelajaran seperti Naskah Film, Storyboard, dan RAB (PDF Viewer).
- **Streaming & Preview**: Embed video player dan trailer.
- **Voting System**: Sistem voting untuk film terfavorit (Trending).
- **Upload & Management**: Creator dapat mengunggah karya; Admin/Moderator mengelola konten.
- **Admin Dashboard**: Manajemen User, Film, Kategori, Laporan, dan Analytics.
- **Brutal Design**: Antarmuka modern dengan gaya Neo-Brutalism (High contrast, bold borders).

## Getting Started

### 1. Setup Backend

Masuk ke folder backend, instal dependensi, dan jalankan server.

```bash
cd backend

# Install dependencies
npm install

# Setup Environment Variables
cp .env.example .env
# (Sesuaikan konfigurasi DB_NAME, DB_USER, DB_PASS di file .env)

# Run Database Migrations & Seeds
npm run migrate
npm run seed

# Start Server
npm run dev
```

Server akan berjalan di `http://localhost:3000`.

### 2. Setup Frontend

Masuk ke folder frontend, instal dependensi, dan jalankan server development.

```bash
cd si-film-archive

# Install dependencies
pnpm install

# Setup Environment Variables (jika perlu)
# Pastikan VITE_API_URL mengarah ke backend (default: http://localhost:3000)

# Start Development Server
pnpm dev
```

Aplikasi akan berjalan di `http://localhost:5173`.

## Design System

**Neo-Brutalist Style:**
- **Border:** Tebal dan hitam (`border-2 border-black`).
- **Shadow:** Hard shadow tanpa blur (`shadow-brutal`).
- **Radius:** Siku tajam (No border radius).
- **Colors:**
  - Red: `#ef4444` (Accent)
  - Teal: `#265C5C` (Primary)
  - Cream: `#F2EEE3` (Background)

## Development Status

- [x] **Backend API**: Terintegrasi (Fastify + MySQL).
- [x] **Frontend UI**: Terimplementasi (Vue 3 + Brutal Design).
- [x] **Authentication**: Terimplementasi (Better Auth).
- [x] **Database**: Migrations & Seeding ready.
- [ ] **Testing**: Unit & E2E Testing (Partial).
