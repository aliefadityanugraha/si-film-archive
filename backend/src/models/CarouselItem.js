import { BaseModel } from './BaseModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class CarouselItem extends BaseModel {
  static get tableName() {
    return 'carousel_items';
  }

  static get idColumn() {
    return 'id';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['image_url'],
      properties: {
        id: { type: 'integer' },
        title: { type: ['string', 'null'] },
        summary: { type: ['string', 'null'] },
        quote: { type: ['string', 'null'] },
        image_url: { type: 'string' },
        film_id: { type: ['integer', 'null'] },
        order: { type: 'integer' },
        is_active: { type: ['boolean', 'integer'] }
      }
    };
  }

  static get relationMappings() {
    return {
      film: {
        relation: BaseModel.BelongsToOneRelation,
        modelClass: path.join(__dirname, 'Film.js'),
        join: {
          from: 'carousel_items.film_id',
          to: 'films.film_id'
        }
      }
    };
  }
}
