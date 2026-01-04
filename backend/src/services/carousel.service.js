import { CarouselItem } from '../models/index.js';

class CarouselService {
  async getAll(activeOnly = false) {
    const query = CarouselItem.query().orderBy('order', 'asc');
    
    if (activeOnly) {
      query.where('is_active', true);
    }

    return query.withGraphFetched('film');
  }

  async getById(id) {
    return CarouselItem.query().findById(id).withGraphFetched('film');
  }

  async create(data) {
    // If order is not provided, put it at the end
    if (data.order === undefined) {
      const maxOrder = await CarouselItem.query().max('order as maxOrder').first();
      data.order = (maxOrder.maxOrder || 0) + 1;
    }
    return CarouselItem.query().insert(data);
  }

  async update(id, data) {
    // Remove film from data if it exists, as it's a relation
    const { film, created_at, updated_at, ...updateData } = data;
    return CarouselItem.query().patchAndFetchById(id, updateData);
  }

  async delete(id) {
    return CarouselItem.query().deleteById(id);
  }

  async updateOrder(items) {
    // items is array of { id, order }
    const promises = items.map(item => 
      CarouselItem.query().patch({ order: item.order }).where('id', item.id)
    );
    return Promise.all(promises);
  }
}

export const carouselService = new CarouselService();
