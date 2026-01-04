import { discussionService } from '../services/index.js';
import { filmService } from '../services/index.js';
import { ROLES } from '../models/index.js';

export class DiscussionController {
  // Public: Get comments for a film (nested/tree structure)
  async getByFilm(request, reply) {
    const { filmId } = request.params;
    const { page, limit } = request.query;

    // Check film exists
    const film = await filmService.getById(filmId);
    
    if (!film) {
      return reply.status(404).send({
        success: false,
        message: 'Film not found'
      });
    }

    if (film.status !== 'published') {
      return reply.status(403).send({
        success: false,
        message: 'Film belum di publish anda tidak dapat memberi komentar'
      });
    }

    const result = await discussionService.getByFilm(filmId, { page, limit });

    return reply.send({
      success: true,
      data: result.comments,
      pagination: result.pagination
    });
  }

  // Public: Get comment count
  async getCommentCount(request, reply) {
    const { filmId } = request.params;

    const count = await discussionService.getCommentCount(filmId);

    return reply.send({
      success: true,
      data: { comment_count: count }
    });
  }

  // User: Create comment
  async create(request, reply) {
    const { filmId } = request.params;
    const { isi_pesan, parent_id } = request.body;

    if (!isi_pesan || !isi_pesan.trim()) {
      return reply.status(400).send({
        success: false,
        message: 'isi_pesan is required'
      });
    }

    // Check film exists
    const film = await filmService.getById(filmId);
    
    if (!film) {
      return reply.status(404).send({
        success: false,
        message: 'Film not found'
      });
    }

    if (film.status !== 'published') {
      return reply.status(403).send({
        success: false,
        message: 'Film belum di publish anda tidak dapat memberi komentar'
      });
    }

    // If replying, check parent exists and depth limit
    if (parent_id) {
      const parent = await discussionService.getById(parent_id);
      if (!parent || parent.film_id !== parseInt(filmId)) {
        return reply.status(400).send({
          success: false,
          message: 'Invalid parent comment'
        });
      }

      // Check depth
      const depth = await discussionService.getCommentDepth(parent_id);
      if (depth >= 5) {
        return reply.status(400).send({
          success: false,
          message: 'Maximum reply depth reached (max 5)'
        });
      }
    }

    const comment = await discussionService.create({
      film_id: parseInt(filmId),
      user_id: request.user.id,
      isi_pesan: isi_pesan.trim(),
      parent_id: parent_id || null
    });

    const created = await discussionService.getById(comment.diskusi_id);

    return reply.status(201).send({
      success: true,
      message: parent_id ? 'Reply posted successfully' : 'Comment posted successfully',
      data: created
    });
  }

  // User: Update own comment
  async update(request, reply) {
    const { id } = request.params;
    const { isi_pesan } = request.body;

    if (!isi_pesan || !isi_pesan.trim()) {
      return reply.status(400).send({
        success: false,
        message: 'isi_pesan is required'
      });
    }

    const comment = await discussionService.getById(id);
    if (!comment) {
      return reply.status(404).send({
        success: false,
        message: 'Comment not found'
      });
    }

    // Only owner can edit
    if (comment.user_id !== request.user.id) {
      return reply.status(403).send({
        success: false,
        message: 'You can only edit your own comments'
      });
    }

    const updated = await discussionService.update(id, isi_pesan.trim());

    return reply.send({
      success: true,
      message: 'Comment updated successfully',
      data: updated
    });
  }

  // User/Moderator: Delete comment
  async delete(request, reply) {
    const { id } = request.params;

    const comment = await discussionService.getById(id);
    if (!comment) {
      return reply.status(404).send({
        success: false,
        message: 'Comment not found'
      });
    }

    // Owner, Moderator, or Admin can delete
    const isOwner = comment.user_id === request.user.id;
    const isModerator = request.user.role_id === ROLES.MODERATOR;
    const isAdmin = request.user.role_id === ROLES.ADMIN;

    console.log('Delete Check:', {
      commentUserId: comment.user_id,
      requestUserId: request.user.id,
      isOwner,
      userRole: request.user.role_id,
      isMod: isModerator,
      isAdmin: isAdmin
    });

    const canDelete = isOwner || isModerator || isAdmin;

    if (!canDelete) {
      return reply.status(403).send({
        success: false,
        message: 'You do not have permission to delete this comment'
      });
    }

    await discussionService.delete(id);

    return reply.send({
      success: true,
      message: 'Comment deleted successfully'
    });
  }

  // Moderator: Get all comments (flat list for moderation)
  async getAllFlat(request, reply) {
    const { page, limit, film_id } = request.query;

    const result = await discussionService.getAllFlat({ page, limit, film_id });

    return reply.send({
      success: true,
      data: result.comments,
      pagination: result.pagination
    });
  }
}

export const discussionController = new DiscussionController();
