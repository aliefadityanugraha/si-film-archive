import { BaseModel } from './BaseModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ChatHistory extends BaseModel {
  static get tableName() {
    return 'chat_history';
  }

  static get idColumn() {
    return 'chat_id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['user_id', 'user_prompt', 'ai_response'],
      properties: {
        chat_id: { type: 'integer' },
        user_id: { type: 'string' },
        user_prompt: { type: 'string' },
        ai_response: { type: 'string' }
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'User.js'),
        join: {
          from: 'chat_history.user_id',
          to: 'users.id'
        }
      }
    };
  }

  $beforeInsert() {
    this.created_at = new Date();
  }

  $beforeUpdate() {
    // No updated_at column
  }
}
