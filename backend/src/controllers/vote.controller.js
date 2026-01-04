import { voteService } from '../services/index.js';
import { filmService } from '../services/index.js';

export class VoteController {
  // User: Vote a film
  async vote(request, reply) {
    const { filmId } = request.params;

    // Check film exists and is published
    const film = await filmService.getById(filmId);
    if (!film || film.status !== 'published') {
      return reply.status(404).send({
        success: false,
        message: 'Film not found'
      });
    }

    const result = await voteService.vote(filmId, request.user.id);

    if (result.alreadyVoted) {
      return reply.status(400).send({
        success: false,
        message: 'You have already voted for this film'
      });
    }

    const voteCount = await voteService.getVoteCount(filmId);

    return reply.send({
      success: true,
      message: 'Vote recorded successfully',
      data: { vote_count: voteCount }
    });
  }

  // User: Unvote a film
  async unvote(request, reply) {
    const { filmId } = request.params;

    const deleted = await voteService.unvote(filmId, request.user.id);

    if (!deleted) {
      return reply.status(400).send({
        success: false,
        message: 'You have not voted for this film'
      });
    }

    const voteCount = await voteService.getVoteCount(filmId);

    return reply.send({
      success: true,
      message: 'Vote removed successfully',
      data: { vote_count: voteCount }
    });
  }

  // User: Toggle vote
  async toggleVote(request, reply) {
    const { filmId } = request.params;

    // Check film exists and is published
    const film = await filmService.getById(filmId);
    if (!film || film.status !== 'published') {
      return reply.status(404).send({
        success: false,
        message: 'Film not found'
      });
    }

    const hasVoted = await voteService.hasVoted(filmId, request.user.id);

    if (hasVoted) {
      await voteService.unvote(filmId, request.user.id);
    } else {
      await voteService.vote(filmId, request.user.id);
    }

    const voteCount = await voteService.getVoteCount(filmId);

    return reply.send({
      success: true,
      message: hasVoted ? 'Vote removed' : 'Vote recorded',
      data: { 
        voted: !hasVoted,
        vote_count: voteCount 
      }
    });
  }

  // Public: Get vote count for a film
  async getVoteCount(request, reply) {
    const { filmId } = request.params;

    const voteCount = await voteService.getVoteCount(filmId);
    
    let hasVoted = false;
    if (request.user) {
      hasVoted = await voteService.hasVoted(filmId, request.user.id);
    }

    return reply.send({
      success: true,
      data: { 
        vote_count: voteCount,
        has_voted: hasVoted
      }
    });
  }

  // Public: Get trending films
  async getTrending(request, reply) {
    const { period = 'week', limit = 10 } = request.query;

    if (!['week', 'month', 'all'].includes(period)) {
      return reply.status(400).send({
        success: false,
        message: 'Invalid period. Use: week, month, or all'
      });
    }

    const films = await voteService.getTrending(period, parseInt(limit));

    return reply.send({
      success: true,
      data: films
    });
  }

  // User: Get my votes
  async getMyVotes(request, reply) {
    const votes = await voteService.getUserVotes(request.user.id);

    return reply.send({
      success: true,
      data: votes
    });
  }
}

export const voteController = new VoteController();
