import { User, Role } from '../models/index.js';

export class AuthService {
  async getUserById(id) {
    return User.query()
      .findById(id)
      .withGraphFetched('role');
  }

  async getUserByEmail(email) {
    return User.query()
      .findOne({ email })
      .withGraphFetched('role');
  }

  async updateUserRole(userId, roleId) {
    return User.query()
      .patchAndFetchById(userId, { role_id: roleId })
      .withGraphFetched('role');
  }

  async updateUser(userId, data) {
    return User.query()
      .patchAndFetchById(userId, data)
      .withGraphFetched('role');
  }

  async getAllUsers() {
    return User.query()
      .select('id', 'email', 'name', 'role_id', 'image', 'createdAt')
      .withGraphFetched('role');
  }

  async getAllRoles() {
    return Role.query();
  }

  async getRoleByName(name) {
    return Role.query().findOne({ name });
  }
}

export const authService = new AuthService();
