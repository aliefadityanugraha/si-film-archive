import { authService } from '../services/index.js';
import { ROLES } from '../models/index.js';
import { saveFile, deleteFile } from '../lib/upload.js';

export class AuthController {
  async getProfile(request, reply) {
    const user = await authService.getUserById(request.user.id);
    
    if (!user) {
      return reply.status(404).send({
        success: false,
        message: 'User not found'
      });
    }

    return reply.send({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
        email_verified: user.email_verified,
        created_at: user.created_at
      }
    });
  }

  async updateRole(request, reply) {
    const { userId } = request.params;
    const { role_id } = request.body;

    if (!Object.values(ROLES).includes(role_id)) {
      return reply.status(400).send({
        success: false,
        message: 'Invalid role_id'
      });
    }

    const user = await authService.updateUserRole(userId, role_id);

    if (!user) {
      return reply.status(404).send({
        success: false,
        message: 'User not found'
      });
    }

    return reply.send({
      success: true,
      message: 'Role updated successfully',
      data: user
    });
  }

  async updateUser(request, reply) {
    let name;
    let imagePath;

    if (request.isMultipart && request.isMultipart()) {
      const parts = request.parts();

      for await (const part of parts) {
        if (part.type === 'file' && part.fieldname === 'image') {
          imagePath = await saveFile(part);
        } else if (part.type === 'field' && part.fieldname === 'name') {
          name = part.value;
        }
      }
    } else if (request.body) {
      name = request.body.name;
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (imagePath) {
      // Get current user to check for existing image
      const currentUser = await authService.getUserById(request.user.id);
      if (currentUser && currentUser.image) {
        await deleteFile(currentUser.image);
      }

      const baseUrl = process.env.API_URL || `${request.protocol}://${request.headers.host}`;
      updateData.image = `${baseUrl}${imagePath}`;
    }

    const user = await authService.updateUser(request.user.id, updateData);

    return reply.send({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  }

  async getAllUsers(request, reply) {
    const users = await authService.getAllUsers();

    return reply.send({
      success: true,
      data: users
    });
  }

  async getAllRoles(request, reply) {
    const roles = await authService.getAllRoles();

    return reply.send({
      success: true,
      data: roles
    });
  }
}

export const authController = new AuthController();
