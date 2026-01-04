import { categoryController } from '../controllers/index.js';
import { requireAdmin } from '../middlewares/index.js';

export default async function categoryRoutes(fastify) {
  // Public: Get all categories
  fastify.get('/', categoryController.getAll.bind(categoryController));

  // Public: Get categories with film count
  fastify.get('/with-count', categoryController.getWithFilmCount.bind(categoryController));

  // Public: Get single category
  fastify.get('/:id', categoryController.getById.bind(categoryController));

  // Admin: Create category
  fastify.post('/', {
    preHandler: requireAdmin
  }, categoryController.create.bind(categoryController));

  // Admin: Update category
  fastify.put('/:id', {
    preHandler: requireAdmin
  }, categoryController.update.bind(categoryController));

  // Admin: Delete category
  fastify.delete('/:id', {
    preHandler: requireAdmin
  }, categoryController.delete.bind(categoryController));
}
