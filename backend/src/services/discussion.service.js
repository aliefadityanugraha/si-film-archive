import { Discussion } from '../models/index.js';

export class DiscussionService {
  async getByFilm(filmId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    // Get root comments (parent_id = null)
    const rootComments = await Discussion.query()
      .where('film_id', filmId)
      .whereNull('parent_id')
      .withGraphFetched('user(selectBasic)')
      .modifiers({
        selectBasic(builder) {
          builder.select('id', 'name', 'image');
        }
      })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalResult = await Discussion.query()
      .where('film_id', filmId)
      .whereNull('parent_id')
      .count('diskusi_id as total')
      .first();

    // Fetch replies for each root comment (nested)
    const commentsWithReplies = await Promise.all(
      rootComments.map(async (comment) => {
        const replies = await this.getRepliesRecursive(comment.diskusi_id);
        return {
          ...comment,
          replies,
          reply_count: this.countReplies(replies)
        };
      })
    );

    return {
      comments: commentsWithReplies,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalResult.total),
        totalPages: Math.ceil(totalResult.total / limit)
      }
    };
  }

  async getRepliesRecursive(parentId, depth = 0, maxDepth = 5) {
    if (depth >= maxDepth) return [];

    const replies = await Discussion.query()
      .where('parent_id', parentId)
      .withGraphFetched('user(selectBasic)')
      .modifiers({
        selectBasic(builder) {
          builder.select('id', 'name', 'image');
        }
      })
      .orderBy('created_at', 'asc');

    // Recursively get nested replies
    return Promise.all(
      replies.map(async (reply) => {
        const nestedReplies = await this.getRepliesRecursive(reply.diskusi_id, depth + 1, maxDepth);
        return {
          ...reply,
          replies: nestedReplies,
          depth: depth + 1
        };
      })
    );
  }

  countReplies(replies) {
    let count = replies.length;
    for (const reply of replies) {
      if (reply.replies) {
        count += this.countReplies(reply.replies);
      }
    }
    return count;
  }

  async getById(id) {
    return Discussion.query()
      .findById(id)
      .withGraphFetched('user(selectBasic)')
      .modifiers({
        selectBasic(builder) {
          builder.select('id', 'name', 'image');
        }
      });
  }

  async create(data) {
    return Discussion.query().insert(data);
  }

  async update(id, isiPesan) {
    return Discussion.query().patchAndFetchById(id, { isi_pesan: isiPesan });
  }

  async delete(id) {
    // Delete all nested replies first (cascade)
    await this.deleteRepliesRecursive(id);
    return Discussion.query().deleteById(id);
  }

  async deleteRepliesRecursive(parentId) {
    const replies = await Discussion.query().where('parent_id', parentId);
    
    for (const reply of replies) {
      await this.deleteRepliesRecursive(reply.diskusi_id);
      await Discussion.query().deleteById(reply.diskusi_id);
    }
  }

  async getCommentDepth(id) {
    let depth = 1;
    let current = await Discussion.query().findById(id).select('parent_id');
    
    while (current && current.parent_id) {
      depth++;
      current = await Discussion.query().findById(current.parent_id).select('parent_id');
    }
    
    return depth;
  }

  async getCommentCount(filmId) {
    const result = await Discussion.query()
      .where('film_id', filmId)
      .count('diskusi_id as total')
      .first();
    return parseInt(result.total);
  }

  // Get flat list (for moderation)
  async getAllFlat(options = {}) {
    const { page = 1, limit = 50, film_id } = options;
    const offset = (page - 1) * limit;

    const query = Discussion.query()
      .withGraphFetched('[user(selectBasic), film(selectFilm)]')
      .modifiers({
        selectBasic(builder) {
          builder.select('id', 'name', 'image');
        },
        selectFilm(builder) {
          builder.select('film_id', 'judul');
        }
      })
      .orderBy('created_at', 'desc');

    if (film_id) {
      query.where('film_id', film_id);
    }

    const [comments, totalResult] = await Promise.all([
      query.limit(limit).offset(offset),
      Discussion.query()
        .modify(q => { if (film_id) q.where('film_id', film_id); })
        .count('diskusi_id as total')
        .first()
    ]);

    return {
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalResult.total),
        totalPages: Math.ceil(totalResult.total / limit)
      }
    };
  }
}

export const discussionService = new DiscussionService();
