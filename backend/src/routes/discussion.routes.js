import { discussionController } from '../controllers/index.js';
import { authenticate, requireModerator } from '../middlewares/index.js';

export default async function discussionRoutes(fastify) {
  // Moderator: Get all comments (flat list)
  fastify.get('/all', {
    preHandler: requireModerator
  }, discussionController.getAllFlat.bind(discussionController));

  // Public: Get comments for a film (nested tree)
  fastify.get('/film/:filmId', discussionController.getByFilm.bind(discussionController));

  // Public: Get comment count for a film
  fastify.get('/film/:filmId/count', discussionController.getCommentCount.bind(discussionController));

  // User: Post comment on a film
  fastify.post('/film/:filmId', {
    preHandler: authenticate
  }, discussionController.create.bind(discussionController));

  // User: Update own comment
  fastify.put('/:id', {
    preHandler: authenticate
  }, discussionController.update.bind(discussionController));

  // User/Moderator: Delete comment
  fastify.delete('/:id', {
    preHandler: authenticate
  }, discussionController.delete.bind(discussionController));
}
