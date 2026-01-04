import { chatService } from '../services/index.js';

export class ChatController {
  // User: Send message to AI
  async chat(request, reply) {
    const { message } = request.body;

    if (!message || !message.trim()) {
      return reply.status(400).send({
        success: false,
        message: 'message is required'
      });
    }

    try {
      const result = await chatService.chat(request.user.id, message.trim());

      return reply.send({
        success: true,
        data: result
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: 'AI service error: ' + error.message
      });
    }
  }

  // User: Get chat history
  async getHistory(request, reply) {
    const { page, limit } = request.query;

    const result = await chatService.getHistory(request.user.id, { page, limit });

    return reply.send({
      success: true,
      data: result.chats,
      pagination: result.pagination
    });
  }

  // User: Clear all chat history
  async clearHistory(request, reply) {
    await chatService.clearHistory(request.user.id);

    return reply.send({
      success: true,
      message: 'Chat history cleared'
    });
  }

  // User: Delete single chat
  async deleteChat(request, reply) {
    const { id } = request.params;

    const deleted = await chatService.deleteChat(id, request.user.id);

    if (!deleted) {
      return reply.status(404).send({
        success: false,
        message: 'Chat not found'
      });
    }

    return reply.send({
      success: true,
      message: 'Chat deleted'
    });
  }
}

export const chatController = new ChatController();
