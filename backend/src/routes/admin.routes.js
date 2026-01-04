import { AdminController } from '../controllers/admin.controller.js';
import { requireAdmin } from '../middlewares/auth.middleware.js';

const adminController = new AdminController();

export default async function adminRoutes(fastify, options) {
  fastify.get('/stats', { preHandler: [requireAdmin] }, adminController.getDashboardStats);
}
