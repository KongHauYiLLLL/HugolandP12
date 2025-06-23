import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { MessageCircle, Send, X, ToggleLeft, ToggleRight } from 'lucide-react';

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Chat: React.FC<ChatProps> = ({ isOpen, onClose }) => {
  const { messages, sendMessage, toggleChat, chatEnabled, isBanned, loading } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isBanned || !chatEnabled) return;

    await sendMessage(newMessage);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-gray-900 p-4 sm:p-6 rounded-lg border border-slate-500/50 max-w-2xl w-full max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-white font-bold text-lg">Global Chat</h2>
              <p className="text-slate-300 text-sm">
                {chatEnabled ? 'Chat with other adventurers' : 'Chat disabled'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleChat}
              className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold transition-all ${
                chatEnabled
                  ? 'bg-green-600 text-white hover:bg-green-500'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
              }`}
            >
              {chatEnabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              {chatEnabled ? 'ON' : 'OFF'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isBanned && (
          <div className="bg-red-900/50 border border-red-500/50 p-3 rounded-lg mb-4">
            <p className="text-red-300 text-sm font-semibold">
              🚫 You have been banned from chat
            </p>
          </div>
        )}

        {!chatEnabled && (
          <div className="bg-yellow-900/50 border border-yellow-500/50 p-3 rounded-lg mb-4">
            <p className="text-yellow-300 text-sm">
              💬 Enable chat to see and send messages
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 bg-black/30 rounded-lg p-4 mb-4 overflow-y-auto min-h-[300px] max-h-[400px]">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin inline-block w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mb-2"></div>
              <p className="text-gray-400">Loading messages...</p>
            </div>
          ) : chatEnabled && messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((message) => (
                <div key={message.id} className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-400 font-semibold text-sm">
                      {message.username}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {formatTime(message.created_at)}
                    </span>
                  </div>
                  <p className="text-white text-sm bg-gray-800/50 rounded-lg px-3 py-2">
                    {message.message}
                  </p>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          ) : chatEnabled ? (
            <div className="text-center py-8">
              <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-2" />
              <p className="text-gray-400">No messages yet</p>
              <p className="text-gray-500 text-sm">Be the first to say hello!</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Chat is disabled</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        {chatEnabled && !isBanned && (
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-black/30 border border-slate-500/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
              maxLength={200}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                newMessage.trim()
                  ? 'bg-blue-600 text-white hover:bg-blue-500'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}

        <div className="text-center text-xs text-gray-500 mt-2">
          <p>Be respectful! Spam and inappropriate content will result in a ban.</p>
        </div>
      </div>
    </div>
  );
};