import { useRef, useEffect, useMemo } from 'react';
import { Bot, ChevronRight, Loader, Plus } from 'lucide-react';
import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui-kit/accordion';
import { useGetAgentConversationList } from '../../hooks/use-agent-conversation';
import { useCategorizedChatHistories } from '../../hooks/use-chat-history-categories';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const projectKey = import.meta.env.VITE_X_BLOCKS_KEY || '';

interface AgentChatAccordionProps {
  agent: any;
  chatId?: string;
  renderChatItem: (chat: any) => React.ReactNode;
  renderChatCategory: (chats: any[], categoryKey: string) => React.ReactNode;
  isMobile: boolean;
  setOpenMobile: (open: boolean) => void;
}

export const AgentChatAccordion = ({
  agent,
  chatId,
  isMobile,
  setOpenMobile,
}: AgentChatAccordionProps) => {
  const agentId = agent.agent_key || agent.id;
  const agentName = agent.agent_name || agent.name || 'Unnamed Agent';
  const widgetId = agent.widget_id;
  const navigate = useNavigate();

  const renderAgentChatItem = (chat: any) => (
    <div
      key={chat.id}
      className={`rounded-lg hover:bg-accent/100 cursor-pointer flex justify-between items-center h-fit group/item px-2 py-1 transition-colors ${
        chatId === chat.id ? 'bg-accent/100' : ''
      }`}
      onClick={() => {
        navigate(`/chat/${chat.id}?agent=${agentId}&widget=${widgetId}`);
        if (isMobile) {
          setOpenMobile(false);
        }
      }}
      role="button"
    >
      <span className="text-sm text-high-emphasis truncate block flex-1 pr-2">{chat.title}</span>
    </div>
  );

  const agentChatListContainerRef = useRef<HTMLDivElement>(null);
  const agentLoadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: agentConversationsData,
    fetchNextPage: fetchNextAgentPage,
    hasNextPage: hasNextAgentPage,
    isFetchingNextPage: isFetchingNextAgentPage,
  } = useGetAgentConversationList({
    agent_id: agentId,
    project_key: projectKey,
  });

  const agentChatList = useMemo(() => {
    if (!agentConversationsData?.pages) {
      return [];
    }

    const seenIds = new Set<string>();
    const allAgentChats = agentConversationsData.pages.flatMap((page) => {
      const filtered = page.sessions.filter((session: any) => {
        const sessionId = session.session_id;
        if (!sessionId) {
          return false;
        }
        if (seenIds.has(sessionId)) {
          return false;
        }
        seenIds.add(sessionId);
        return true;
      });

      return filtered.map((session: any) => ({
        id: session.session_id,
        lastEntryDate: session.last_entry_date,
        title:
          session.conversation?.Title?.slice(0, 35) ||
          session.conversation?.Response?.slice(0, 35) ||
          session.conversation?.Query ||
          'Untitled Agent Chat',
      }));
    });

    return allAgentChats;
  }, [agentConversationsData?.pages]);

  const categorizedAgentChats = useCategorizedChatHistories(agentChatList);

  const handleNewAgentChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    const agentModel = {
      isBlocksModels: false,
      provider: 'agents',
      model: agentId,
      widget_id: agent.widget_id,
    };
    navigate(`/chat`, {
      state: {
        selectedModel: agentModel,
      },
    });

    if (isMobile) {
      setOpenMobile(false);
    }
  };

  useEffect(() => {
    const setupAgentObserver = () => {
      const currentLoadMoreRef = agentLoadMoreRef.current;
      const scrollContainer = agentChatListContainerRef.current;

      if (!currentLoadMoreRef || !scrollContainer) {
        return null;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && hasNextAgentPage && !isFetchingNextAgentPage) {
              fetchNextAgentPage();
            }
          });
        },
        {
          root: scrollContainer,
          rootMargin: '200px',
          threshold: 0.1,
        }
      );

      observer.observe(currentLoadMoreRef);
      return observer;
    };

    let observer = setupAgentObserver();
    const timeouts: NodeJS.Timeout[] = [];

    if (!observer) {
      const delays = isMobile ? [100, 300, 500, 1000] : [100, 300];
      delays.forEach((delay) => {
        const timeout = setTimeout(() => {
          if (!observer) {
            observer = setupAgentObserver();
          }
        }, delay);
        timeouts.push(timeout);
      });
    }

    return () => {
      if (observer) {
        observer.disconnect();
      }
      timeouts.forEach(clearTimeout);
    };
  }, [
    hasNextAgentPage,
    isFetchingNextAgentPage,
    fetchNextAgentPage,
    agentChatList.length,
    isMobile,
  ]);

  useEffect(() => {
    const setupAgentScrollListener = () => {
      const scrollContainer = agentChatListContainerRef.current;

      if (!scrollContainer) {
        return null;
      }

      const handleScroll = () => {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;
        const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

        if (scrollPercentage > 0.75 && hasNextAgentPage && !isFetchingNextAgentPage) {
          fetchNextAgentPage();
        }
      };

      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });

      return () => {
        scrollContainer.removeEventListener('scroll', handleScroll);
      };
    };

    let cleanup = setupAgentScrollListener();
    const timeouts: NodeJS.Timeout[] = [];

    if (!cleanup) {
      const delays = isMobile ? [100, 300, 500, 1000] : [100, 300];
      delays.forEach((delay) => {
        const timeout = setTimeout(() => {
          if (!cleanup) {
            cleanup = setupAgentScrollListener();
          }
        }, delay);
        timeouts.push(timeout);
      });
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
      timeouts.forEach(clearTimeout);
    };
  }, [hasNextAgentPage, isFetchingNextAgentPage, fetchNextAgentPage, isMobile]);

  return (
    <AccordionItem value={agentId} className="border-none">
      <AccordionTrigger
        className={cn(
          'hover:no-underline px-2 py-1.5 rounded-lg transition-all duration-200',
          'group/trigger hover:[&:not(:has(button:hover))]:bg-accent/50',
          '[&[data-state=open]]:bg-accent/30',
          '[&>svg]:hidden',
          'w-full min-w-0'
        )}
      >
        <div className="flex items-center w-full min-w-0 gap-2">
          <Bot className="h-4 w-4 text-primary flex-shrink-0" />

          <span className="text-sm font-medium truncate flex-1 min-w-0 text-left" title={agentName}>
            {agentName}
          </span>

          <div
            role="button"
            tabIndex={0}
            className="h-6 w-6 p-0 hover:bg-primary/10 transition-colors flex-shrink-0 flex items-center justify-center rounded-md cursor-pointer"
            onClick={handleNewAgentChat}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleNewAgentChat(e as any);
              }
            }}
            title={`New chat with ${agentName}`}
          >
            <Plus className="h-3.5 w-3.5 text-primary" />
          </div>

          <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 flex-shrink-0 group-data-[state=open]/trigger:rotate-90" />
        </div>
      </AccordionTrigger>

      <AccordionContent className="pb-0 pt-1">
        {agentChatList.length === 0 ? (
          <div className="py-1 px-2 text-center">
            <p className="text-xs text-muted-foreground italic mb-2">No conversations yet</p>
          </div>
        ) : (
          <div
            ref={agentChatListContainerRef}
            className="overflow-y-auto overflow-x-visible space-y-4 pl-1"
            style={{ maxHeight: 'calc(100vh - 400px)' }}
          >
            {categorizedAgentChats.today.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">TODAY</h3>
                <div className="space-y-1">
                  {categorizedAgentChats.today.map(renderAgentChatItem)}
                </div>
              </div>
            )}
            {categorizedAgentChats.yesterday.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">YESTERDAY</h3>
                <div className="space-y-1">
                  {categorizedAgentChats.yesterday.map(renderAgentChatItem)}
                </div>
              </div>
            )}
            {categorizedAgentChats.previous7Days.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                  PREVIOUS 7 DAYS
                </h3>
                <div className="space-y-1">
                  {categorizedAgentChats.previous7Days.map(renderAgentChatItem)}
                </div>
              </div>
            )}
            {categorizedAgentChats.previous30Days.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">
                  PREVIOUS 30 DAYS
                </h3>
                <div className="space-y-1">
                  {categorizedAgentChats.previous30Days.map(renderAgentChatItem)}
                </div>
              </div>
            )}
            {categorizedAgentChats.older.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground mb-2 px-2">OLDER</h3>
                <div className="space-y-1">
                  {categorizedAgentChats.older.map(renderAgentChatItem)}
                </div>
              </div>
            )}

            {hasNextAgentPage && <div ref={agentLoadMoreRef} className="h-10 w-full" />}

            {isFetchingNextAgentPage && (
              <div className="flex items-center justify-center py-3">
                <Loader className="w-4 h-4 text-muted-foreground animate-spin" />
              </div>
            )}
          </div>
        )}
      </AccordionContent>
    </AccordionItem>
  );
};
