import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
}

export const useChat = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && profile?.chat_enabled) {
      loadMessages();
      subscribeToMessages();
    }
  }, [user, profile?.chat_enabled]);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setMessages(data?.reverse() || []);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToMessages = () => {
    const subscription = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: 'is_deleted=eq.false',
        },
        (payload) => {
          const newMessage = payload.new as ChatMessage;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  };

  const sendMessage = async (message: string) => {
    if (!user || !profile || profile.is_banned || !profile.chat_enabled) {
      return;
    }

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: user.id,
          username: profile.username,
          message: message.trim(),
        });

      if (error) throw error;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const toggleChat = async () => {
    if (!profile) return;

    const newChatEnabled = !profile.chat_enabled;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ chat_enabled: newChatEnabled })
        .eq('user_id', user?.id);

      if (error) throw error;

      // Update will be handled by the auth hook
    } catch (err) {
      console.error('Error toggling chat:', err);
      setError(err instanceof Error ? err.message : 'Failed to toggle chat');
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    toggleChat,
    chatEnabled: profile?.chat_enabled || false,
    isBanned: profile?.is_banned || false,
  };
};