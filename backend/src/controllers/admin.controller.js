import { User } from '../models/User.js';
import { Film } from '../models/Film.js';
import { Discussion } from '../models/Discussion.js';
import { Category } from '../models/Category.js';

export class AdminController {
  async getDashboardStats(request, reply) {
    try {
      const [
        totalFilms,
        totalUsers,
        pendingFilms,
        totalCategories,
        recentPendingFilms,
        recentActivities
      ] = await Promise.all([
        Film.query().resultSize(),
        User.query().resultSize(),
        Film.query().where('status', 'pending').resultSize(),
        Category.query().resultSize(),
        Film.query()
          .where('status', 'pending')
          .withGraphFetched('creator')
          .orderBy('created_at', 'desc')
          .limit(5),
        // Simplistic recent activities from films
        Film.query()
          .withGraphFetched('creator')
          .orderBy('updated_at', 'desc')
          .limit(5)
      ]);

      return {
        success: true,
        data: {
          totalFilms,
          totalUsers,
          pendingFilms,
          totalCategories,
          recentPendingFilms,
          recentActivities: recentActivities.map(f => ({
            user: f.creator?.name || 'Unknown',
            action: f.status === 'published' ? 'published' : 'uploaded',
            target: f.judul,
            time: f.updated_at
          }))
        }
      };
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        success: false,
        message: 'Internal server error while fetching dashboard stats'
      });
    }
  }
}
