import { voteController } from '../controllers/index.js';
import { authenticate, optionalAuth, requireAdmin } from '../middlewares/index.js';

export default async function voteRoutes(fastify) {
  // Admin: Reset all votes
  fastify.post('/reset', {
    preHandler: [authenticate, requireAdmin]
  }, voteController.resetVotes.bind(voteController));

  // Public: Get trending films
  fastify.get('/trending', voteController.getTrending.bind(voteController));

  // Public: Get vote count (with optional auth to check if user voted)
  fastify.get('/film/:filmId', {
    preHandler: optionalAuth
  }, voteController.getVoteCount.bind(voteController));

  // User: Get my votes
  fastify.get('/my-votes', {
    preHandler: authenticate
  }, voteController.getMyVotes.bind(voteController));

  // User: Vote a film
  fastify.post('/film/:filmId', {
    preHandler: authenticate
  }, voteController.vote.bind(voteController));

  // User: Toggle vote (vote/unvote)
  fastify.post('/film/:filmId/toggle', {
    preHandler: authenticate
  }, voteController.toggleVote.bind(voteController));

  // User: Unvote a film
  fastify.delete('/film/:filmId', {
    preHandler: authenticate
  }, voteController.unvote.bind(voteController));
}
