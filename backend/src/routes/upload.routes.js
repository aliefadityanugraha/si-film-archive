import { uploadController } from '../controllers/upload.controller.js';
import { authenticate } from '../middlewares/index.js';

export default async function uploadRoutes(fastify) {
  fastify.post('/', {
    preHandler: [authenticate]
  }, uploadController.uploadFile.bind(uploadController));
}
