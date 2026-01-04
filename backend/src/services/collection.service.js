import { Collection, Film } from '../models/index.js';

export class CollectionService {
  async add(filmId, userId) {
    const filmIdInt = parseInt(filmId);
    
    // Check if already in collection
    const existing = await Collection.query()
      .findOne({ film_id: filmIdInt, user_id: userId });

    if (existing) {
      return { alreadyInCollection: true };
    }

    await Collection.query().insert({
      film_id: filmIdInt,
      user_id: userId
    });

    return { alreadyInCollection: false };
  }

  async remove(filmId, userId) {
    const filmIdInt = parseInt(filmId);
    const deleted = await Collection.query()
      .delete()
      .where({ film_id: filmIdInt, user_id: userId });

    return deleted > 0;
  }

  async isInCollection(filmId, userId) {
    if (!userId) return false;
    const filmIdInt = parseInt(filmId);
    const item = await Collection.query()
      .findOne({ film_id: filmIdInt, user_id: userId });
    return !!item;
  }

  async getUserCollections(userId) {
    return Collection.query()
      .where('user_id', userId)
      .withGraphFetched('film.[creator(selectBasic), category]')
      .modifiers({
        selectBasic(builder) {
          builder.select('id', 'name', 'image');
        }
      })
      .orderBy('created_at', 'desc');
  }
}

export const collectionService = new CollectionService();
