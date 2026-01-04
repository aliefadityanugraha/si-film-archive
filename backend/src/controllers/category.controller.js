import { categoryService } from '../services/index.js';

export class CategoryController {
  async getAll(request, reply) {
    const categories = await categoryService.getAll();

    return reply.send({
      success: true,
      data: categories
    });
  }

  async getById(request, reply) {
    const { id } = request.params;
    const category = await categoryService.getById(id);

    if (!category) {
      return reply.status(404).send({
        success: false,
        message: 'Category not found'
      });
    }

    return reply.send({
      success: true,
      data: category
    });
  }

  async create(request, reply) {
    const { nama_kategori, deskripsi } = request.body;

    if (!nama_kategori) {
      return reply.status(400).send({
        success: false,
        message: 'nama_kategori is required'
      });
    }

    const category = await categoryService.create({
      nama_kategori,
      deskripsi
    });

    return reply.status(201).send({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  }

  async update(request, reply) {
    const { id } = request.params;
    const { nama_kategori, deskripsi } = request.body;

    const existing = await categoryService.getById(id);
    if (!existing) {
      return reply.status(404).send({
        success: false,
        message: 'Category not found'
      });
    }

    const category = await categoryService.update(id, {
      nama_kategori,
      deskripsi
    });

    return reply.send({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  }

  async delete(request, reply) {
    const { id } = request.params;

    const existing = await categoryService.getById(id);
    if (!existing) {
      return reply.status(404).send({
        success: false,
        message: 'Category not found'
      });
    }

    await categoryService.delete(id);

    return reply.send({
      success: true,
      message: 'Category deleted successfully'
    });
  }

  async getWithFilmCount(request, reply) {
    const categories = await categoryService.getWithFilmCount();

    const data = categories.map(cat => ({
      ...cat,
      film_count: cat.films?.length || 0,
      films: undefined
    }));

    return reply.send({
      success: true,
      data
    });
  }
}

export const categoryController = new CategoryController();
