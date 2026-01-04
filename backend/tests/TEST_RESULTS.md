# SI Film Archive - API Test Results

**Test Date:** December 30, 2024  
**Environment:** Development  
**Server:** http://localhost:3000

---

## Test Summary

| Feature | Status | Notes |
|---------|--------|-------|
| Health Check | ✅ PASS | API running |
| Authentication | ✅ PASS | Login, Register, Session |
| User Profile | ✅ PASS | Get profile with role |
| Categories CRUD | ✅ PASS | Create, Read, Update, Delete |
| Films CRUD | ✅ PASS | Create, Read, Update, Delete |
| Film Approval | ✅ PASS | Approve, Reject |
| Votes | ✅ PASS | Vote, Unvote, Toggle, Trending |
| Discussions | ✅ PASS | Comment, Reply, Nested, Update, Delete |

---

## Detailed Test Results

### 1. Authentication

```
=== LOGIN ===
Logged in as: Test User (role_id: 4)
```

✅ Login successful  
✅ Session cookie received  
✅ User data returned with role_id

---

### 2. Films

```
=== CREATE FILM 1 ===
Created: Film Pendek Pertama (film_id: 8)

=== CREATE FILM 2 ===
Created: Dokumenter Kampus (film_id: 9)

=== GET PENDING FILMS ===
Pending films: 2
  - Film Pendek Pertama (id: 8)
  - Dokumenter Kampus (id: 9)

=== APPROVE FILM 1 ===
Approved: Film Pendek Pertama -> published

=== APPROVE FILM 2 ===
Approved: Dokumenter Kampus -> published

=== GET PUBLISHED FILMS ===
Published films: 9
  - Film Pendek Pertama (id: 8)
  - Dokumenter Kampus (id: 9)
  - Film Pendek Pertama (id: 6)
  - Dokumenter Kampus (id: 7)
  - Film Pendek Pertama (id: 4)
  - Dokumenter Kampus (id: 5)
  - Film Pendek Pertama (id: 2)
  - Dokumenter Kampus (id: 3)
  - Dokumenter Kampus (id: 1)
```

✅ Create film with crew JSON  
✅ Film created with status "pending"  
✅ Get pending films (admin)  
✅ Approve film -> status "published"  
✅ Get published films with pagination

---

### 3. Votes

```
=== VOTE FILM ===
Vote recorded successfully - vote_count: 1

=== GET VOTE COUNT ===
Film 8 - votes: 1, has_voted: True

=== TOGGLE VOTE ===
Vote removed - voted: False, count: 0

=== GET TRENDING ===
Trending films:
  - Dokumenter Kampus (votes: 0)
  - Film Pendek Pertama (votes: 0)
```

✅ Vote film  
✅ Get vote count with has_voted status  
✅ Toggle vote (vote/unvote)  
✅ Get trending films

---

### 4. Discussions (Comments)

```
=== POST COMMENT ===
Comment: 'Film yang sangat bagus! Suka banget.' (id: 5)

=== POST COMMENT 2 ===
Comment: 'Ceritanya menarik!'

=== REPLY TO COMMENT ===
Reply: 'Setuju banget!' (parent: 5)

=== NESTED REPLY ===
Nested reply: 'Iya bener!'

=== GET COMMENTS (Nested Tree) ===
Root comments: 2
  - Film yang sangat bagus! Suka banget. [replies: 2]
    - Setuju banget!
      - Iya bener!
  - Ceritanya menarik! [replies: 0]

=== GET COMMENT COUNT ===
Total comments: 4

=== UPDATE COMMENT ===
Updated: 'Film yang sangat bagus! (edited)'

=== GET ALL COMMENTS (Flat) ===
All comments: 8
```

✅ Post comment  
✅ Reply to comment (parent_id)  
✅ Nested reply (depth 2)  
✅ Get comments as nested tree  
✅ Reply count calculated correctly  
✅ Get total comment count  
✅ Update comment  
✅ Get all comments flat (moderator)

---

## API Endpoints Tested

### Authentication
- [x] `POST /api/auth/sign-up/email` - Register
- [x] `POST /api/auth/sign-in/email` - Login
- [x] `GET /api/auth/session` - Get session
- [x] `GET /api/auth/profile` - Get profile

### Categories
- [x] `GET /api/categories` - List all
- [x] `POST /api/categories` - Create (admin)
- [x] `PUT /api/categories/:id` - Update (admin)
- [x] `DELETE /api/categories/:id` - Delete (admin)

### Films
- [x] `GET /api/films` - List published
- [x] `GET /api/films/:id` - Get single
- [x] `GET /api/films/pending` - List pending (admin)
- [x] `GET /api/films/my-films` - List own films (creator)
- [x] `POST /api/films` - Create (creator)
- [x] `PUT /api/films/:id` - Update (owner)
- [x] `PATCH /api/films/:id/approve` - Approve (admin)
- [x] `PATCH /api/films/:id/reject` - Reject (admin)
- [x] `DELETE /api/films/:id` - Delete (owner)

### Votes
- [x] `GET /api/votes/trending` - Get trending
- [x] `GET /api/votes/film/:filmId` - Get vote count
- [x] `POST /api/votes/film/:filmId` - Vote
- [x] `POST /api/votes/film/:filmId/toggle` - Toggle vote
- [x] `DELETE /api/votes/film/:filmId` - Unvote
- [x] `GET /api/votes/my-votes` - Get my votes

### Discussions
- [x] `GET /api/discussions/film/:filmId` - Get comments (nested)
- [x] `GET /api/discussions/film/:filmId/count` - Get count
- [x] `POST /api/discussions/film/:filmId` - Post comment
- [x] `PUT /api/discussions/:id` - Update comment
- [x] `DELETE /api/discussions/:id` - Delete comment
- [x] `GET /api/discussions/all` - Get all flat (moderator)

---

## Test Environment

- **Node.js:** v18+
- **Database:** MySQL 8.0
- **OS:** Windows 11

---

## How to Run Tests

```bash
cd backend
powershell -ExecutionPolicy Bypass -File tests/test-full.ps1
```

Or use REST Client extension in VS Code with `tests/api.http`
