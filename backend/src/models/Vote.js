import { Model } from 'objection';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Vote extends Model {
  static get tableName() {
    return 'votes';
  }

  static get idColumn() {
    return 'vote_id';
  }

  $beforeInsert() {
    this.created_at = new Date();
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['film_id', 'user_id'],
      properties: {
        vote_id: { type: 'integer' },
        film_id: { type: 'integer' },
        user_id: { type: 'string' }
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'User.js'),
        join: {
          from: 'votes.user_id',
          to: 'users.id'
        }
      },
      film: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Film.js'),
        join: {
          from: 'votes.film_id',
          to: 'films.film_id'
        }
      }
    };
  }
}
