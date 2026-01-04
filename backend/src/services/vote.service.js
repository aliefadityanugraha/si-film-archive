import { Vote, Film } from '../models/index.js';
import { knex } from '../database/index.js';

export class VoteService {
  async vote(filmId, userId) {
    const filmIdInt = parseInt(filmId);
    // Check if already voted
    const existing = await Vote.query()
      .findOne({ film_id: filmIdInt, user_id: userId });

    if (existing) {
      return { alreadyVoted: true };
    }

    await Vote.query().insert({
      film_id: filmIdInt,
      user_id: userId
    });

    return { alreadyVoted: false };
  }

  async unvote(filmId, userId) {
    const filmIdInt = parseInt(filmId);
    const deleted = await Vote.query()
      .delete()
      .where({ film_id: filmIdInt, user_id: userId });

    return deleted > 0;
  }

  async hasVoted(filmId, userId) {
    const filmIdInt = parseInt(filmId);
    const vote = await Vote.query()
      .findOne({ film_id: filmIdInt, user_id: userId });
    return !!vote;
  }

  async getVoteCount(filmId) {
    const filmIdInt = parseInt(filmId);
    const result = await Vote.query()
      .where('film_id', filmIdInt)
      .count('vote_id as count')
      .first();
    return parseInt(result.count);
  }

  async getTrending(period = 'week', limit = 10) {
    let dateFilter;
    const now = new Date();

    if (period === 'week') {
      dateFilter = new Date(now.setDate(now.getDate() - 7));
    } else if (period === 'month') {
      dateFilter = new Date(now.setMonth(now.getMonth() - 1));
    } else {
      // all time
      dateFilter = null;
    }

    const query = knex('films')
      .select(
        'films.*',
        knex.raw('COUNT(votes.vote_id) as vote_count')
      )
      .leftJoin('votes', function() {
        this.on('films.film_id', '=', 'votes.film_id');
        if (dateFilter) {
          this.andOn('votes.created_at', '>=', knex.raw('?', [dateFilter]));
        }
      })
      .where('films.status', 'published')
      .groupBy('films.film_id')
      .orderBy('vote_count', 'desc')
      .limit(limit);

    const films = await query;

    // Fetch relations manually
    const filmIds = films.map(f => f.film_id);
    if (filmIds.length === 0) return [];

    const filmsWithRelations = await Film.query()
      .whereIn('film_id', filmIds)
      .withGraphFetched('[creator(selectBasic), category]')
      .modifiers({
        selectBasic(builder) {
          builder.select('id', 'name', 'image');
        }
      });

    // Merge vote_count
    return filmsWithRelations.map(film => {
      const voteData = films.find(f => f.film_id === film.film_id);
      return {
        ...film,
        vote_count: parseInt(voteData?.vote_count || 0)
      };
    }).sort((a, b) => b.vote_count - a.vote_count);
  }

  async getUserVotes(userId) {
    return Vote.query()
      .where('user_id', userId)
      .withGraphFetched('film')
      .orderBy('created_at', 'desc');
  }
}

export const voteService = new VoteService();
