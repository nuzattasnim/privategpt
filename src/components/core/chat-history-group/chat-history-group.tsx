import { ChatHistoryGroup } from '@/types/chat-history.type';
import { ChatHistoryItemComponent } from '../chat-history-item/chat-history-item';

interface ChatHistoryGroupComponentProps {
  group: ChatHistoryGroup;
  onDelete?: (chatId: string) => void;
  showText: boolean;
}

/**
 * ChatHistoryGroupComponent
 *
 * Groups chat history items by time periods (Today, Yesterday, etc.)
 */
export const ChatHistoryGroupComponent = ({
  group,
  onDelete,
  showText,
}: ChatHistoryGroupComponentProps) => {
  if (group.items.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      {showText && (
        <div className="mb-2 px-2">
          <p className="text-xs font-medium uppercase text-medium-emphasis">{group.label}</p>
        </div>
      )}
      <div className="space-y-1">
        {group.items.map((item) => (
          <ChatHistoryItemComponent
            key={item.id}
            item={item}
            onDelete={onDelete}
            showText={showText}
          />
        ))}
      </div>
    </div>
  );
};
