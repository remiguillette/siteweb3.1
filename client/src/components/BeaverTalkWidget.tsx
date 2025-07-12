import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle, X, Send, AlertTriangle } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface BeaverTalkConfig {
  userId?: string;
  userName?: string;
  userEmail?: string;
  userDepartment?: string;
  category?: 'general' | 'technical' | 'emergency' | 'feedback';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  baseUrl?: string;
  username?: string;
  password?: string;
}

interface BeaverTalkMessage {
  id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'agent';
  messageContent: string;
  messageType: 'text' | 'image' | 'file';
  timestamp: string;
  securityScore?: number;
  threadId?: string;
  isFiltered?: boolean;
  userAgent?: string;
  ipAddress?: string;
}

interface BeaverTalkWidgetProps {
  config?: BeaverTalkConfig;
}

export const BeaverTalkWidget: React.FC<BeaverTalkWidgetProps> = ({ 
  config = {} 
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<BeaverTalkMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Default configuration for BeaverTalk API
  const apiConfig = {
    baseUrl: config.baseUrl || import.meta.env.VITE_BEAVERTALK_API_URL || 'https://your-beavernet-domain.com/api/chat',
    username: config.username || import.meta.env.VITE_BEAVERTALK_USERNAME || 'remiguillette',
    password: config.password || import.meta.env.VITE_BEAVERTALK_PASSWORD || 'MC44rg99qc@',
    userId: config.userId || `rgra_user_${Math.random().toString(36).substr(2, 9)}`,
    userName: config.userName || 'RGRA Website User',
    userEmail: config.userEmail,
    userDepartment: config.userDepartment,
    category: config.category || 'general',
    priority: config.priority || 'normal'
  };

  const credentials = btoa(`${apiConfig.username}:${apiConfig.password}`);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Test connection to BeaverTalk API
  const testConnection = async () => {
    try {
      setConnectionStatus('connecting');
      
      console.log('BeaverTalk API Config:', {
        baseUrl: apiConfig.baseUrl,
        username: apiConfig.username,
        hasPassword: !!apiConfig.password
      });
      
      // Try to connect to the API health endpoint
      const response = await fetch(`${apiConfig.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('BeaverTalk API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        contentType: response.headers.get('content-type')
      });

      // Check if we got a JSON response (real API) or HTML (website)
      const contentType = response.headers.get('content-type');
      const isHtml = contentType && contentType.includes('text/html');

      if (response.ok && !isHtml) {
        setConnectionStatus('connected');
        setIsConnected(true);
        setError(null);
      } else if (isHtml) {
        throw new Error('BeaverTalk API endpoints not available. The server is returning the website instead of API responses.');
      } else {
        throw new Error(`Connection failed: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('BeaverTalk connection error:', error);
      setConnectionStatus('disconnected');
      setIsConnected(false);
      
      // Provide more specific error messages
      if (error.message.includes('API endpoints not available')) {
        setError('BeaverTalk API is not yet deployed. Please contact support for API endpoint setup.');
      } else if (error.message.includes('Failed to fetch')) {
        setError('Unable to connect to BeaverTalk server. Please check your internet connection.');
      } else {
        setError(`Connection failed: ${error.message}`);
      }
    }
  };

  // Test connection when widget opens
  useEffect(() => {
    if (isOpen && !isConnected) {
      testConnection();
    }
  }, [isOpen]);

  const generateSessionId = () => {
    return `rgra_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const createSession = async (): Promise<string> => {
    const newSessionId = generateSessionId();
    
    const sessionData = {
      sessionId: newSessionId,
      userId: apiConfig.userId,
      userName: apiConfig.userName,
      userEmail: apiConfig.userEmail,
      userDepartment: apiConfig.userDepartment,
      category: apiConfig.category,
      priority: apiConfig.priority,
      clientSite: window.location.hostname,
      referrerUrl: window.location.href,
    };

    try {
      const response = await fetch(`${apiConfig.baseUrl}/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create session: ${response.status}`);
      }

      const session = await response.json();
      setSessionId(newSessionId);
      return newSessionId;
    } catch (error) {
      console.error('Failed to create session:', error);
      throw new Error('Failed to create chat session');
    }
  };

  const fetchMessages = useCallback(async (currentSessionId: string) => {
    try {
      const response = await fetch(`${apiConfig.baseUrl}/messages/${currentSessionId}`, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }

      const newMessages = await response.json();
      setMessages(newMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [credentials, apiConfig.baseUrl]);

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

      const messageData = {
        sessionId: currentSessionId,
        senderId: apiConfig.userId,
        senderName: apiConfig.userName,
        senderType: 'user',
        messageContent: inputValue,
        messageType: 'text',
      };

      const response = await fetch(`${apiConfig.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        throw new Error(`Failed to send message: ${response.status}`);
      }

      setInputValue('');
      
      // Immediately fetch updated messages
      await fetchMessages(currentSessionId);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setError(t.chat.error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeSession = async () => {
    if (sessionId) {
      try {
        await fetch(`${apiConfig.baseUrl}/sessions/${sessionId}/status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'closed' })
        });
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
          aria-label={t.chat.openChat}
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
              <h3 className="font-bold text-lg">{t.chat.title}</h3>
              <p className="text-sm opacity-90">{t.chat.subtitle}</p>
            </div>
            <button 
              onClick={handleToggleChat} 
              className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/20"
              aria-label={t.chat.closeChat}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 space-y-4">
            {/* Connection Status */}
            {connectionStatus === 'connecting' && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300 p-3 rounded-lg text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.chat.connecting}</span>
                </div>
              </div>
            )}

            {connectionStatus === 'connected' && (
              <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    B
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{t.chat.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {t.chat.welcome}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {connectionStatus === 'disconnected' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
                <div className="flex flex-col space-y-2">
                  <div>
                    <p className="font-medium">Connection Failed</p>
                    <p className="text-xs mt-1">{error || 'Unable to connect to BeaverTalk support system'}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-red-600 dark:text-red-400">Please contact support directly for assistance</p>
                    <button
                      onClick={testConnection}
                      className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              </div>
            )}

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
                placeholder={connectionStatus === 'connected' ? t.chat.placeholder : 'Connecting to BeaverTalk...'}
                disabled={isLoading || connectionStatus !== 'connected'}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim() || connectionStatus !== 'connected'}
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
              Press Enter to send • {t.chat.poweredBy}
            </p>
          </div>
        </div>
      )}
    </>
  );
};