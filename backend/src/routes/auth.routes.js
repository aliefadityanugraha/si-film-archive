import { authController } from '../controllers/index.js';
import { authenticate, requireAdmin } from '../middlewares/index.js';

export default async function authRoutes(fastify) {
  // Get current user profile
  fastify.get('/profile', {
    preHandler: authenticate
  }, authController.getProfile.bind(authController));

  // Update current user profile
  fastify.patch('/update-user', {
    preHandler: authenticate
  }, authController.updateUser.bind(authController));

  // Get all roles
  fastify.get('/roles', {
    preHandler: authenticate
  }, authController.getAllRoles.bind(authController));

  // Admin: Get all users
  fastify.get('/users', {
    preHandler: requireAdmin
  }, authController.getAllUsers.bind(authController));

  // Admin: Update user role
  fastify.patch('/users/:userId/role', {
    preHandler: requireAdmin
  }, authController.updateRole.bind(authController));
}
