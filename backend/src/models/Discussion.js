import { Model } from 'objection';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Discussion extends Model {
  static get tableName() {
    return 'discussions';
  }

  static get idColumn() {
    return 'diskusi_id';
  }

  $beforeInsert() {
    this.created_at = new Date();
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['film_id', 'user_id', 'isi_pesan'],
      properties: {
        diskusi_id: { type: 'integer' },
        film_id: { type: 'integer' },
        user_id: { type: 'string' },
        isi_pesan: { type: 'string' },
        parent_id: { type: ['integer', 'null'] }
      }
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'User.js'),
        join: {
          from: 'discussions.user_id',
          to: 'users.id'
        }
      },
      film: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Film.js'),
        join: {
          from: 'discussions.film_id',
          to: 'films.film_id'
        }
      },
      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Discussion,
        join: {
          from: 'discussions.parent_id',
          to: 'discussions.diskusi_id'
        }
      },
      replies: {
        relation: Model.HasManyRelation,
        modelClass: Discussion,
        join: {
          from: 'discussions.diskusi_id',
          to: 'discussions.parent_id'
        }
      }
    };
  }
}
