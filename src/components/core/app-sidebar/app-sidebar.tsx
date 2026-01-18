import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar, SidebarContent, SidebarHeader, useSidebar } from '@/components/ui-kit/sidebar';
import { useTheme } from '@/styles/theme/theme-provider';
import { getSidebarStyle } from '@/lib/utils/sidebar-utils';
import { LogoSection, NewChatButton, ChatHistoryGroupComponent } from '@/components/core';
import { useChatHistory } from '@/hooks/use-chat-history';

/**
 * AppSidebar Component
 *
 * A responsive, collapsible sidebar navigation component that displays dynamic chat history
 * similar to ChatGPT's interface.
 *
 * Features:
 * - Collapsible sidebar with smooth transition animations
 * - Different logos for expanded and collapsed states
 * - Auto-collapses on mobile when route changes
 * - Dynamic chat history grouped by time periods (Today, Yesterday, etc.)
 * - New chat button for creating new conversations
 * - Highlights active chat based on current route
 * - Supports both icon-only and icon-with-text display modes
 *
 * Dependencies:
 * - Requires useSidebar context for controlling sidebar state
 * - Uses React Router's useLocation for active item highlighting
 * - Uses useChatHistory hook for managing chat history data
 *
 * @example
 * // Basic usage in layout component
 * <AppLayout>
 *   <AppSidebar />
 *   <MainContent />
 * </AppLayout>
 *
 * // With SidebarProvider
 * <SidebarProvider>
 *   <AppLayout>
 *     <AppSidebar />
 *     <MainContent />
 *   </AppLayout>
 * </SidebarProvider>
 */

export const AppSidebar = () => {
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const { setOpenMobile, open, isMobile, openMobile } = useSidebar();

  const { groupedChatHistory, isLoading, deleteChat, createNewChat } = useChatHistory();

  useEffect(() => {
    if (!isMobile) {
      setOpenMobile(false);
    }
  }, [pathname, setOpenMobile, isMobile]);

  const sidebarStyle = getSidebarStyle(isMobile, open, openMobile);

  if (isMobile && !openMobile) {
    return null;
  }

  return (
    <Sidebar
      className={`bg-gradient-to-b from-card to-card/95 h-full border-r border-border/50 backdrop-blur-xl ${
        isMobile ? 'mobile-sidebar' : ''
      }`}
      collapsible={isMobile ? 'none' : 'icon'}
      style={sidebarStyle}
    >
      <SidebarHeader
        className={`${
          !open && !isMobile ? 'border-b border-border/50' : ''
        } p-3 bg-gradient-to-b from-background/50 to-transparent`}
      >
        <LogoSection
          theme={theme}
          open={open}
          isMobile={isMobile}
          onClose={() => setOpenMobile(false)}
        />
      </SidebarHeader>

      <SidebarContent className="text-base mx-3 my-4 text-high-emphasis font-normal overflow-x-hidden">
        <div className="px-1 mb-4">
          <NewChatButton onNewChat={createNewChat} showText={open || isMobile} />
        </div>

        {isLoading ? (
          <div className="px-3 py-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce" />
              <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="h-1.5 w-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="ml-2">Loading chats...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {groupedChatHistory.map((group, index) => (
              <ChatHistoryGroupComponent
                key={group.label}
                group={group}
                onDelete={deleteChat}
                showText={open || isMobile}
                index={index}
              />
            ))}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};
