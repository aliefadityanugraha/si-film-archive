export async function seed(knex) {
  // Clear existing
  await knex('categories').del();

  // Insert categories
  await knex('categories').insert([
    { 
      category_id: 1, 
      nama_kategori: 'Film Pendek', 
      deskripsi: 'Film dengan durasi di bawah 30 menit' 
    },
    { 
      category_id: 2, 
      nama_kategori: 'Dokumenter', 
      deskripsi: 'Film dokumenter non-fiksi' 
    },
    { 
      category_id: 3, 
      nama_kategori: 'Animasi', 
      deskripsi: 'Film animasi 2D/3D' 
    },
    { 
      category_id: 4, 
      nama_kategori: 'Musikal', 
      deskripsi: 'Film dengan elemen musik dan lagu' 
    },
    { 
      category_id: 5, 
      nama_kategori: 'Eksperimental', 
      deskripsi: 'Film dengan pendekatan eksperimental dan avant-garde' 
    }
  ]);
}
