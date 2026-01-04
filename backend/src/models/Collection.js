import { Model } from 'objection';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Collection extends Model {
  static get tableName() {
    return 'collections';
  }

  static get idColumn() {
    return 'collection_id';
  }

  $beforeInsert() {
    this.created_at = new Date();
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['film_id', 'user_id'],
      properties: {
        collection_id: { type: 'integer' },
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
          from: 'collections.user_id',
          to: 'users.id'
        }
      },
      film: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Film.js'),
        join: {
          from: 'collections.film_id',
          to: 'films.film_id'
        }
      }
    };
  }
}
