import { BaseModel } from './BaseModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Role extends BaseModel {
  static get tableName() {
    return 'roles';
  }

  static get idColumn() {
    return 'role_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        role_id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: ['string', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      users: {
        relation: BaseModel.HasManyRelation,
        modelClass: path.join(__dirname, 'User.js'),
        join: {
          from: 'roles.role_id',
          to: 'users.role_id'
        }
      }
    };
  }
}

// Role constants
export const ROLES = {
  USER: 1,
  CREATOR: 2,
  MODERATOR: 3,
  ADMIN: 4
};

export const ROLE_NAMES = {
  1: 'user',
  2: 'creator',
  3: 'moderator',
  4: 'admin'
};
