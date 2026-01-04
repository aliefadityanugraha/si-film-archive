import { BaseModel } from './BaseModel.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Category extends BaseModel {
  static get tableName() {
    return 'categories';
  }

  static get idColumn() {
    return 'category_id';
  }

  static get relationMappings() {
    return {
      films: {
        relation: BaseModel.HasManyRelation,
        modelClass: path.join(__dirname, 'Film.js'),
        join: {
          from: 'categories.category_id',
          to: 'films.category_id'
        }
      }
    };
  }
}
