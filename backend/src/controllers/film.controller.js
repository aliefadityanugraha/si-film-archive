import { filmService } from '../services/index.js';
import { ROLES } from '../models/index.js';

export class FilmController {
  // Public: Get all published films (or all films for admin)
  async getAll(request, reply) {
    const { page, limit, category_id, search, sortBy, sortOrder, status } = request.query;

    // Admin and Moderator can filter by any status, public only sees published
    let filterStatus = 'published';
    if (request.user && (request.user.role_id === ROLES.ADMIN || request.user.role_id === ROLES.MODERATOR)) {
      if (status) {
        filterStatus = status === 'all' ? null : status;
      }
    }

    try {
      const options = {
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
        category_id,
        search: search || null,
        sortBy: sortBy || 'films.created_at',
        sortOrder: sortOrder || 'desc',
        status: filterStatus,
        requesting_user_id: request.user?.id
      };

      const result = await filmService.getAll(options);

      return reply.send({
        success: true,
        data: result.films,
        pagination: result.pagination
      });
    } catch (err) {
      console.error('Film search error:', err);
      return reply.status(500).send({
        success: false,
        message: 'Internal server error during search'
      });
    }
  }

  // Public: Get single film
  async getById(request, reply) {
    const { id } = request.params;
    const film = await filmService.getById(id);

    if (!film) {
      return reply.status(404).send({
        success: false,
        message: 'Film not found'
      });
    }

    // Only show published films to public, or own films to creator
    if (film.status !== 'published') {
      if (!request.user || (request.user.id !== film.user_id && request.user.role_id !== ROLES.ADMIN)) {
        return reply.status(404).send({
          success: false,
          message: 'Film not found'
        });
      }
    }

    return reply.send({
      success: true,
      data: film
    });
  }

  // Public: Get latest films
  async getLatest(request, reply) {
    const limit = request.query.limit || 10;
    const films = await filmService.getLatest(limit);

    return reply.send({
      success: true,
      data: films
    });
  }

  // Creator: Create new film
  async create(request, reply) {
    const {
      category_id,
      judul,
      sinopsis,
      tahun_karya,
      link_video_utama,
      link_trailer,
      gambar_poster,
      deskripsi_lengkap,
      file_naskah,
      file_storyboard,
      file_rab,
      crew
    } = request.body;

    if (!judul) {
      return reply.status(400).send({
        success: false,
        message: 'judul is required'
      });
    }

    const film = await filmService.create({
      user_id: request.user.id,
      category_id,
      judul,
      sinopsis,
      tahun_karya,
      link_video_utama,
      link_trailer,
      gambar_poster,
      deskripsi_lengkap,
      file_naskah,
      file_storyboard,
      file_rab,
      crew: crew || null,
      status: 'pending'
    });

    return reply.status(201).send({
      success: true,
      message: 'Film created successfully. Waiting for admin approval.',
      data: film
    });
  }

  // Creator: Update own film
  async update(request, reply) {
    const { id } = request.params;
    const film = await filmService.getById(id);

    if (!film) {
      return reply.status(404).send({
        success: false,
        message: 'Film not found'
      });
    }

    // Only creator or admin can update
    if (film.user_id !== request.user.id && request.user.role_id !== ROLES.ADMIN) {
      return reply.status(403).send({
        success: false,
        message: 'You can only update your own films'
      });
    }

    const {
      category_id,
      judul,
      sinopsis,
      tahun_karya,
      link_video_utama,
      link_trailer,
      gambar_poster,
      deskripsi_lengkap,
      file_naskah,
      file_storyboard,
      file_rab,
      crew
    } = request.body;

    const updateData = {};
    if (category_id !== undefined) updateData.category_id = category_id;
    if (judul !== undefined) updateData.judul = judul;
    if (sinopsis !== undefined) updateData.sinopsis = sinopsis;
    if (tahun_karya !== undefined) updateData.tahun_karya = tahun_karya;
    if (link_video_utama !== undefined) updateData.link_video_utama = link_video_utama;
    if (link_trailer !== undefined) updateData.link_trailer = link_trailer;
    if (gambar_poster !== undefined) updateData.gambar_poster = gambar_poster;
    if (deskripsi_lengkap !== undefined) updateData.deskripsi_lengkap = deskripsi_lengkap;
    if (file_naskah !== undefined) updateData.file_naskah = file_naskah;
    if (file_storyboard !== undefined) updateData.file_storyboard = file_storyboard;
    if (file_rab !== undefined) updateData.file_rab = file_rab;
    if (crew !== undefined) updateData.crew = crew;

    // Reset to pending if creator updates (needs re-approval)
    if (request.user.role_id !== ROLES.ADMIN && film.status === 'published') {
      updateData.status = 'pending';
    }

    const updated = await filmService.update(id, updateData);

    return reply.send({
      success: true,
      message: 'Film updated successfully',
      data: updated
    });
  }

  // Creator: Delete own film
  async delete(request, reply) {
    const { id } = request.params;
    const film = await filmService.getById(id);

    if (!film) {
      return reply.status(404).send({
        success: false,
        message: 'Film not found'
      });
    }

    // Only creator or admin can delete
    if (film.user_id !== request.user.id && request.user.role_id !== ROLES.ADMIN) {
      return reply.status(403).send({
        success: false,
        message: 'You can only delete your own films'
      });
    }

    await filmService.delete(id);

    return reply.send({
      success: true,
      message: 'Film deleted successfully'
    });
  }

  // Creator: Get my films
  async getMyFilms(request, reply) {
    const { page, limit, status } = request.query;

    const result = await filmService.getAll({
      page,
      limit,
      user_id: request.user.id,
      status: status || null
    });

    return reply.send({
      success: true,
      data: result.films,
      pagination: result.pagination
    });
  }

  // Admin: Get pending films
  async getPending(request, reply) {
    const films = await filmService.getPending();

    return reply.send({
      success: true,
      data: films
    });
  }

  // Admin: Approve film
  async approve(request, reply) {
    const { id } = request.params;
    const film = await filmService.getById(id);

    if (!film) {
      return reply.status(404).send({
        success: false,
        message: 'Film not found'
      });
    }

    const updated = await filmService.updateStatus(id, 'published');

    return reply.send({
      success: true,
      message: 'Film approved and published',
      data: updated
    });
  }

  // Admin: Reject film
  async reject(request, reply) {
    const { id } = request.params;
    const film = await filmService.getById(id);

    if (!film) {
      return reply.status(404).send({
        success: false,
        message: 'Film not found'
      });
    }

    const updated = await filmService.updateStatus(id, 'rejected');

    return reply.send({
      success: true,
      message: 'Film rejected',
      data: updated
    });
  }
}

export const filmController = new FilmController();
