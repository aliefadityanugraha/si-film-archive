import * as carouselController from '../controllers/carousel.controller.js';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';

export default async function (fastify, opts) {
  // Public route
  fastify.get('/public', carouselController.getPublicCarousel);

  // Admin routes
  fastify.get('/', { preHandler: [authenticate, requireAdmin] }, carouselController.getAll);
  fastify.post('/', { preHandler: [authenticate, requireAdmin] }, carouselController.create);
  fastify.put('/:id', { preHandler: [authenticate, requireAdmin] }, carouselController.update);
  fastify.delete('/:id', { preHandler: [authenticate, requireAdmin] }, carouselController.remove);
  fastify.post('/reorder', { preHandler: [authenticate, requireAdmin] }, carouselController.reorder);
}
