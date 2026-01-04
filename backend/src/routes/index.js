import authRoutes from './auth.routes.js';
import categoryRoutes from './category.routes.js';
import filmRoutes from './film.routes.js';
import voteRoutes from './vote.routes.js';
import discussionRoutes from './discussion.routes.js';
import chatRoutes from './chat.routes.js';
import collectionRoutes from './collection.routes.js';
import adminRoutes from './admin.routes.js';
import carouselRoutes from './carousel.routes.js';
import uploadRoutes from './upload.routes.js';

export default async function routes(fastify) {
  // Auth routes
  await fastify.register(authRoutes, { prefix: '/auth' });

  // Upload routes
  await fastify.register(uploadRoutes, { prefix: '/upload' });

  // Category routes
  await fastify.register(categoryRoutes, { prefix: '/categories' });

  // Film routes
  await fastify.register(filmRoutes, { prefix: '/films' });

  // Vote routes
  await fastify.register(voteRoutes, { prefix: '/votes' });

  // Discussion routes
  await fastify.register(discussionRoutes, { prefix: '/discussions' });

  // AI Chat routes
  await fastify.register(chatRoutes, { prefix: '/chat' });

  // Collection routes
  await fastify.register(collectionRoutes, { prefix: '/collections' });

  // Admin routes
  await fastify.register(adminRoutes, { prefix: '/admin' });

  // Carousel routes
  await fastify.register(carouselRoutes, { prefix: '/carousel' });

  // Health check
  fastify.get('/health', async () => {
    return { 
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString()
    };
  });
}
