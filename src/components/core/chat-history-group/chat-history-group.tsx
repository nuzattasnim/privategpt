import { ChatHistoryGroup } from '@/types/chat-history.type';
import { ChatHistoryItemComponent } from '../chat-history-item/chat-history-item';

interface ChatHistoryGroupComponentProps {
  group: ChatHistoryGroup;
  onDelete?: (chatId: string) => void;
  showText: boolean;
  index?: number;
}

/**
 * ChatHistoryGroupComponent
 *
 * Groups chat history items by time periods (Today, Yesterday, etc.)
 * with modern animations and visual enhancements
 */
export const ChatHistoryGroupComponent = ({
  group,
  onDelete,
  showText,
  index = 0,
}: ChatHistoryGroupComponentProps) => {
  if (group.items.length === 0) {
    return null;
  }

  return (
    <div
      className="animate-in fade-in slide-in-from-left-4 duration-500"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {showText && (
        <div className="mb-3 px-3">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <p className="text-xs font-semibold uppercase text-muted-foreground/80 tracking-wider px-2">
              {group.label}
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>
        </div>
      )}
      <div className="space-y-1.5 px-1">
        {group.items.map((item, itemIndex) => (
          <ChatHistoryItemComponent
            key={item.id}
            item={item}
            onDelete={onDelete}
            showText={showText}
            index={itemIndex}
          />
        ))}
      </div>
    </div>
  );
};
