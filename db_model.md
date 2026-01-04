C. Tabel Films (Arsip Karya)
Tabel utama penyimpanan data film.
-	film_id (PK, Integer, Auto Increment)
-	user_id (FK, Integer)
 ID User (Creator) yang mengupload film
-	category_id (FK, Integer)
 Kategori film (menggantikan genre manual)
-	judul (Varchar)
-	sinopsis (Text)
-	tahun_karya (Year)
-	link_video_utama (Varchar)
-	link_trailer (Varchar)
-	gambar_poster (Varchar)
-	filosofi_poster (Text)
-	file_naskah (Varchar)
-	file_storyboard (Varchar)
-	file_rab (Varchar)
-	crew (JSON)
 Data kru film dalam format array of object,
 setiap jabatan memiliki array anggota (display-only)
status (Enum: 'pending', 'published', 'rejected')
-	created_at (Timestamp)
 Digunakan untuk fitur Film Terbaru
E. Tabel Discussions (Diskusi & Komentar)
-	diskusi_id (PK, Integer, Auto Increment)
-	film_id (FK, Integer)
-	user_id (FK, Integer)
-	isi_pesan (Text)
-	parent_id (Integer, Nullable) - Diisi ID diskusi lain jika ini adalah balasan (Reply).
-	created_at (Timestamp)
F. Tabel Votes (Trending System)
-	vote_id (PK, Integer, Auto Increment)
-	film_id (FK, Integer)
-	user_id (FK, Integer)
-	created_at (Timestamp) - Agar bisa filter trending "Minggu Ini" vs "Sepanjang Masa".
G. Tabel Chat_History (Fitur AI)
-	chat_id (PK, Integer, Auto Increment)
-	user_id (FK, Integer)
-	user_prompt (Text)
-	ai_response (Text)
-	created_at (Timestamp)
Relasi Antar Tabel 
1.	Users ➝ Films: One-to-Many
○	(1 Creator bisa mengupload banyak Film).
2.	Categories ➝ Films: One-to-Many
○	(1 Kategori menaungi banyak Film).
3.	Users ➝ Discussions: One-to-Many
○	(1 User bisa menulis banyak komentar).
4.	Films ➝ Discussions: One-to-Many
○	(1 Film bisa memiliki banyak komentar).
5.	Users ➝ Votes: One-to-Many
○	(1 User bisa melakukan vote ke banyak film).
6.	Films ➝ Votes: One-to-Many
○	(1 Film bisa mendapatkan banyak vote).
7.	Users ➝ Chat_History: One-to-Many
○	(1 User bisa memiliki banyak riwayat percakapan AI).
Entity Relationship Diagram
