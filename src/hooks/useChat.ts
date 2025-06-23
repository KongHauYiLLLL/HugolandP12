import { useState, useEffect } from 'react';

export interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
}

export const useChat = () => {
  const [messages] = useState<ChatMessage[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    // No-op for offline mode
    console.log('Chat disabled in offline mode:', message);
  };

  const toggleChat = async () => {
    // No-op for offline mode
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    toggleChat,
    chatEnabled: false,
    isBanned: false,
  };
};