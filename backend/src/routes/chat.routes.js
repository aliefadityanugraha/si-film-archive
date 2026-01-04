import { chatController } from '../controllers/index.js';
import { authenticate } from '../middlewares/index.js';

export default async function chatRoutes(fastify) {
  // All chat routes require authentication
  fastify.addHook('preHandler', authenticate);

  // Send message to AI
  fastify.post('/', chatController.chat.bind(chatController));

  // Get chat history
  fastify.get('/history', chatController.getHistory.bind(chatController));

  // Clear all history
  fastify.delete('/history', chatController.clearHistory.bind(chatController));

  // Delete single chat
  fastify.delete('/:id', chatController.deleteChat.bind(chatController));
}
