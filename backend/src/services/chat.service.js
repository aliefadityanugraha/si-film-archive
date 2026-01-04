import { ChatHistory } from '../models/index.js';
import { getAI } from '../lib/ai/index.js';

export class ChatService {
  async chat(userId, userPrompt) {
    const ai = getAI();

    // Get recent chat history for context (last 10 messages)
    const history = await this.getRecentHistory(userId, 5);
    
    // Build messages array with history
    const messages = [];
    for (const chat of history.reverse()) {
      messages.push({ role: 'user', content: chat.user_prompt });
      messages.push({ role: 'assistant', content: chat.ai_response });
    }
    messages.push({ role: 'user', content: userPrompt });

    // Get AI response
    const response = await ai.chat(messages);

    // Save to history
    const saved = await ChatHistory.query().insert({
      user_id: userId,
      user_prompt: userPrompt,
      ai_response: response.content
    });

    return {
      chat_id: saved.chat_id,
      user_prompt: userPrompt,
      ai_response: response.content,
      model: response.model
    };
  }

  async getHistory(userId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const [chats, totalResult] = await Promise.all([
      ChatHistory.query()
        .where('user_id', userId)
        .orderBy('created_at', 'desc')
        .limit(limit)
        .offset(offset),
      ChatHistory.query()
        .where('user_id', userId)
        .count('chat_id as total')
        .first()
    ]);

    return {
      chats: chats.reverse(), // Oldest first for display
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(totalResult.total),
        totalPages: Math.ceil(totalResult.total / limit)
      }
    };
  }

  async getRecentHistory(userId, limit = 5) {
    return ChatHistory.query()
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(limit);
  }

  async clearHistory(userId) {
    return ChatHistory.query()
      .where('user_id', userId)
      .delete();
  }

  async deleteChat(chatId, userId) {
    return ChatHistory.query()
      .where('chat_id', chatId)
      .where('user_id', userId)
      .delete();
  }
}

export const chatService = new ChatService();
