import { collectionController } from '../controllers/index.js';
import { authenticate, optionalAuth } from '../middlewares/index.js';

export default async function collectionRoutes(fastify) {
  // User: Get my collections
  fastify.get('/my-collections', {
    preHandler: authenticate
  }, collectionController.getMyCollections.bind(collectionController));

  // User: Get collection status for a film
  fastify.get('/status/:filmId', {
    preHandler: optionalAuth
  }, collectionController.getStatus.bind(collectionController));

  // User: Toggle collection
  fastify.post('/toggle/:filmId', {
    preHandler: authenticate
  }, collectionController.toggleCollection.bind(collectionController));
}
