import { BaseModel } from './BaseModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class User extends BaseModel {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'name'],
      properties: {
        id: { type: 'string' },
        email: { type: 'string', format: 'email' },
        name: { type: 'string', minLength: 1 },
        emailVerified: { type: 'boolean' },
        image: { type: ['string', 'null'] },
        role_id: { type: 'integer', default: 1 },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    };
  }

  $beforeInsert() {
    const now = new Date();
    this.createdAt = now;
    this.updatedAt = now;
    if (this.role_id === undefined) {
      this.role_id = 1;
    }
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }

  static get relationMappings() {
    return {
      role: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Role.js'),
        join: {
          from: 'users.role_id',
          to: 'roles.role_id'
        }
      },
      films: {
        relation: BaseModel.HasManyRelation,
        modelClass: path.join(__dirname, 'Film.js'),
        join: {
          from: 'users.id',
          to: 'films.user_id'
        }
      },
      discussions: {
        relation: BaseModel.HasManyRelation,
        modelClass: path.join(__dirname, 'Discussion.js'),
        join: {
          from: 'users.id',
          to: 'discussions.user_id'
        }
      },
      votes: {
        relation: BaseModel.HasManyRelation,
        modelClass: path.join(__dirname, 'Vote.js'),
        join: {
          from: 'users.id',
          to: 'votes.user_id'
        }
      },
      chatHistory: {
        relation: BaseModel.HasManyRelation,
        modelClass: path.join(__dirname, 'ChatHistory.js'),
        join: {
          from: 'users.id',
          to: 'chat_history.user_id'
        }
      }
    };
  }
}
