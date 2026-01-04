import { Model } from 'objection';

export class BaseModel extends Model {
  $beforeInsert() {
    const now = new Date();
    this.created_at = now;
    this.updated_at = now;
  }

  $beforeUpdate() {
    this.updated_at = new Date();
  }
}
