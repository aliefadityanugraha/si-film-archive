import { collectionService, filmService } from '../services/index.js';

export class CollectionController {
  // User: Toggle collection
  async toggleCollection(request, reply) {
    const { filmId } = request.params;

    // Check film exists and is published
    const film = await filmService.getById(filmId);
    if (!film || film.status !== 'published') {
      return reply.status(404).send({
        success: false,
        message: 'Film not found'
      });
    }

    const isInCollection = await collectionService.isInCollection(filmId, request.user.id);

    if (isInCollection) {
      await collectionService.remove(filmId, request.user.id);
    } else {
      await collectionService.add(filmId, request.user.id);
    }

    return reply.send({
      success: true,
      message: isInCollection ? 'Film removed from collection' : 'Film added to collection',
      data: { 
        is_in_collection: !isInCollection
      }
    });
  }

  // User: Get collection status for a film
  async getStatus(request, reply) {
    const { filmId } = request.params;
    
    let isInCollection = false;
    if (request.user) {
      isInCollection = await collectionService.isInCollection(filmId, request.user.id);
    }

    return reply.send({
      success: true,
      data: { 
        is_in_collection: isInCollection
      }
    });
  }

  // User: Get my collections
  async getMyCollections(request, reply) {
    const collections = await collectionService.getUserCollections(request.user.id);

    return reply.send({
      success: true,
      data: collections
    });
  }
}

export const collectionController = new CollectionController();
