# 📦 API Response Best Practice

Dokumen ini menjelaskan **standar best practice response JSON API** agar:
- konsisten
- mudah dikonsumsi frontend (Vue / React)
- mudah di-maintain
- scalable untuk pengembangan jangka panjang

---

## 🎯 Tujuan

- Menyamakan format response di semua endpoint
- Mempermudah handling data & error di frontend
- Menghindari breaking change
- Meningkatkan readability dan debugging

---

## 🧱 Struktur Response Standar

### ✅ Success Response
```json
{
  "success": true,
  "message": "Operasi berhasil",
  "data": {}
}
```

### ❌ Error Response
```json
{
  "success": false,
  "message": "Terjadi kesalahan",
  "errors": {}
}
```

---

## 🧩 Field Penjelasan

| Field | Tipe | Wajib | Keterangan |
|------|------|------|-----------|
| `success` | boolean | ✅ | Status operasi |
| `message` | string | ✅ | Pesan untuk user |
| `data` | object / array | ❌ | Data utama |
| `errors` | object | ❌ | Detail error (validasi) |
| `meta` | object | ❌ | Informasi tambahan (pagination) |
| `code` | string | ❌ | Kode error internal |

---

## 🌐 HTTP Status Code

| Kondisi | Status |
|------|------|
| GET sukses | `200 OK` |
| CREATE sukses | `201 Created` |
| Validasi gagal | `400 Bad Request` |
| Tidak login | `401 Unauthorized` |
| Tidak punya akses | `403 Forbidden` |
| Data tidak ditemukan | `404 Not Found` |
| Error server | `500 Internal Server Error` |

📌 Jangan selalu return `200 OK`.

---

## 🧪 Contoh Kasus

### GET Data
```json
{
  "success": true,
  "message": "Data user berhasil diambil",
  "data": {
    "id": 1,
    "name": "Alief",
    "email": "alief@mail.com"
  }
}
```

### CREATE Data
```json
{
  "success": true,
  "message": "User berhasil dibuat",
  "data": {
    "id": 10
  }
}
```

### Validasi Gagal
```json
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "email": "Email sudah digunakan",
    "password": "Minimal 8 karakter"
  }
}
```

### Data Tidak Ditemukan
```json
{
  "success": false,
  "code": "DATA_NOT_FOUND",
  "message": "Data tidak ditemukan"
}
```

---

## 📄 Pagination

```json
{
  "success": true,
  "message": "List user",
  "data": [
    { "id": 1, "name": "A" },
    { "id": 2, "name": "B" }
  ],
  "meta": {
    "page": 1,
    "per_page": 10,
    "total": 57,
    "total_pages": 6
  }
}
```

---

## ✍️ Penamaan Field

- Gunakan **snake_case**
- Konsisten di seluruh API

```json
{
  "created_at": "2025-12-29T08:00:00Z"
}
```

---

## 🔒 Keamanan

❌ Jangan pernah return:
- password (termasuk hash)
- token rahasia
- field internal yang tidak diperlukan

---

## 🧠 Error Code Internal (Opsional)

```json
{
  "success": false,
  "code": "UNAUTHORIZED",
  "message": "Silakan login ulang"
}
```

---

## 🧩 Standar Final

```json
{
  "success": true | false,
  "message": "Pesan untuk user",
  "data": {} | [],
  "errors": {},
  "meta": {},
  "code": "ERROR_CODE"
}
```

---

## 📌 Penutup

Standar ini membantu menjaga konsistensi API, mempermudah frontend development, dan meningkatkan kualitas aplikasi secara keseluruhan.
