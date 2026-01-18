import { useState, useEffect, useMemo } from 'react';
import { ChatHistoryItem, ChatHistoryGroup } from '@/types/chat-history.type';

/**
 * Custom hook for managing chat history
 *
 * This hook provides functionality to:
 * - Fetch and manage chat history items
 * - Group chats by time periods (Today, Yesterday, Previous 7 Days, etc.)
 * - Add new chat sessions
 * - Delete existing chats
 * - Update chat titles
 *
 * @returns {Object} Chat history state and methods
 */
export const useChatHistory = () => {
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch chat history from backend or local storage
  useEffect(() => {
    const fetchChatHistory = async () => {
      setIsLoading(true);
      try {
        // TODO: Replace with actual API call to fetch chat history
        // const response = await graphqlClient.query({ query: GET_CHAT_HISTORY });
        // setChatHistory(response.data.chatHistory);

        // Mock data for now
        const mockHistory: ChatHistoryItem[] = [
          {
            id: 'e82ce28c-3c13-41fc-ab73-ebd438d4456c',
            title: 'Coding Assistant Introduction',
            lastMessage: 'How can I help you today?',
            timestamp: new Date(),
          },
          {
            id: 'a1b2c3d4-5678-90ab-cdef-1234567890ab',
            title: 'React TypeScript Project',
            lastMessage: 'Let me help you set that up...',
            timestamp: new Date(Date.now() - 86400000), // Yesterday
          },
          {
            id: 'b2c3d4e5-6789-01bc-def0-234567890abc',
            title: 'GraphQL Query Help',
            lastMessage: 'Here is the query structure...',
            timestamp: new Date(Date.now() - 86400000 * 3), // 3 days ago
          },
        ];

        setChatHistory(mockHistory);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, []);

  // Group chat history by time periods
  const groupedChatHistory = useMemo((): ChatHistoryGroup[] => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const sevenDaysAgo = new Date(today.getTime() - 86400000 * 7);
    const thirtyDaysAgo = new Date(today.getTime() - 86400000 * 30);

    const groups: ChatHistoryGroup[] = [
      { label: 'Today', items: [] },
      { label: 'Yesterday', items: [] },
      { label: 'Previous 7 Days', items: [] },
      { label: 'Previous 30 Days', items: [] },
      { label: 'Older', items: [] },
    ];

    chatHistory.forEach((chat) => {
      const chatDate = new Date(chat.timestamp);

      if (chatDate >= today) {
        groups[0].items.push(chat);
      } else if (chatDate >= yesterday) {
        groups[1].items.push(chat);
      } else if (chatDate >= sevenDaysAgo) {
        groups[2].items.push(chat);
      } else if (chatDate >= thirtyDaysAgo) {
        groups[3].items.push(chat);
      } else {
        groups[4].items.push(chat);
      }
    });

    // Filter out empty groups
    return groups.filter((group) => group.items.length > 0);
  }, [chatHistory]);

  const createNewChat = () => {
    const newChatId = crypto.randomUUID();
    const newChat: ChatHistoryItem = {
      id: newChatId,
      title: 'New Chat',
      timestamp: new Date(),
    };

    setChatHistory((prev) => [newChat, ...prev]);
    return newChatId;
  };

  const deleteChat = (chatId: string) => {
    setChatHistory((prev) => prev.filter((chat) => chat.id !== chatId));
  };

  const updateChatTitle = (chatId: string, newTitle: string) => {
    setChatHistory((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, title: newTitle } : chat))
    );
  };

  return {
    chatHistory,
    groupedChatHistory,
    isLoading,
    createNewChat,
    deleteChat,
    updateChatTitle,
  };
};
