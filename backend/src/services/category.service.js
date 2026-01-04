import { Category } from '../models/index.js';

export class CategoryService {
  async getAll() {
    return Category.query().orderBy('nama_kategori');
  }

  async getById(id) {
    return Category.query().findById(id);
  }

  async create(data) {
    return Category.query().insert(data);
  }

  async update(id, data) {
    return Category.query().patchAndFetchById(id, data);
  }

  async delete(id) {
    return Category.query().deleteById(id);
  }

  async getWithFilmCount() {
    return Category.query()
      .select('categories.*')
      .withGraphFetched('films(onlyPublished)')
      .modifiers({
        onlyPublished(builder) {
          builder.where('status', 'published').select('film_id');
        }
      });
  }
}

export const categoryService = new CategoryService();
