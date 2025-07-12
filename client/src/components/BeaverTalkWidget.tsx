import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle, X, Send, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { apiRequest } from '@/lib/queryClient';
import type { ChatMessage, ChatSession, InsertChatSession, InsertChatMessage } from '@shared/schema';

interface BeaverTalkConfig {
  userId?: string;
  userName?: string;
  userEmail?: string;
  userDepartment?: string;
  category?: 'general' | 'technical' | 'emergency' | 'feedback';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

interface BeaverTalkWidgetProps {
  config?: BeaverTalkConfig;
}

export const BeaverTalkWidget: React.FC<BeaverTalkWidgetProps> = ({ 
  config = {} 
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateSessionId = () => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const createSession = async (): Promise<string> => {
    const newSessionId = generateSessionId();
    
    const sessionData: InsertChatSession = {
      sessionId: newSessionId,
      userId: config.userId || `rgra_user_${Math.random().toString(36).substr(2, 9)}`,
      userName: config.userName || 'RGRA Website User',
      userEmail: config.userEmail,
      userDepartment: config.userDepartment,
      category: config.category || 'general',
      priority: config.priority || 'normal',
      clientSite: window.location.hostname,
      referrerUrl: window.location.href,
    };

    try {
      await apiRequest('POST', '/api/chat/sessions', sessionData);
      
      setSessionId(newSessionId);
      return newSessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw new Error('Failed to create chat session');
    }
  };

  const fetchMessages = useCallback(async (currentSessionId: string) => {
    try {
      const response = await apiRequest('GET', `/api/chat/messages/${currentSessionId}`);
      const newMessages = await response.json();
      setMessages(newMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  const startPolling = useCallback((sessionId: string) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    
    pollIntervalRef.current = setInterval(() => {
      fetchMessages(sessionId);
    }, 3000); // Poll every 3 seconds
  }, [fetchMessages]);

  const stopPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      let currentSessionId = sessionId;
      
      if (!currentSessionId) {
        currentSessionId = await createSession();
        startPolling(currentSessionId);
      }

      const messageData: InsertChatMessage = {
        sessionId: currentSessionId,
        senderId: config.userId || `rgra_user_${Math.random().toString(36).substr(2, 9)}`,
        senderName: config.userName || 'RGRA Website User',
        senderType: 'user',
        messageContent: inputValue,
        messageType: 'text',
      };

      await apiRequest('POST', '/api/chat/messages', messageData);

      setInputValue('');
      
      // Immediately fetch updated messages
      await fetchMessages(currentSessionId);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeSession = async () => {
    if (sessionId) {
      try {
        await apiRequest('PATCH', `/api/chat/sessions/${sessionId}/status`, { status: 'closed' });
      } catch (error) {
        console.error('Error closing session:', error);
      }
    }
    
    stopPolling();
    setSessionId(null);
    setMessages([]);
    setError(null);
  };

  const handleToggleChat = () => {
    if (isOpen) {
      closeSession();
    }
    setIsOpen(!isOpen);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
      closeSession();
    };
  }, []);

  return (
    <>
      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={handleToggleChat}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 group"
          aria-label="Open chat support"
        >
          <MessageCircle size={24} className="group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">!</span>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] bg-white dark:bg-gray-900 rounded-lg shadow-2xl z-50 flex flex-col border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">BeaverTalk Support</h3>
              <p className="text-sm opacity-90">We're here to help</p>
            </div>
            <button 
              onClick={handleToggleChat} 
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 space-y-4">
            {/* Welcome Message */}
            <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  B
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">BeaverTalk Support</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Welcome! How can I help you today?
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderType === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                    message.senderType === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.senderType !== 'user' && (
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        B
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm">{message.messageContent}</p>
                      {message.securityScore && message.securityScore < 70 && (
                        <div className="flex items-center space-x-1 mt-2 text-xs opacity-70">
                          <AlertTriangle size={12} />
                          <span>Security: {message.securityScore}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg transition-all duration-200 flex items-center space-x-1 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Press Enter to send • Powered by BeaverTalk
            </p>
          </div>
        </div>
      )}
    </>
  );
};