import { Link, useParams } from 'react-router-dom';
import { MessageSquare, Trash2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui-kit/dropdown-menu';
import { Button } from '@/components/ui-kit/button';
import { ChatHistoryItem } from '@/types/chat-history.type';

interface ChatHistoryItemComponentProps {
  item: ChatHistoryItem;
  onDelete?: (chatId: string) => void;
  showText: boolean;
}

/**
 * ChatHistoryItemComponent
 *
 * Individual chat history item in the sidebar
 */
export const ChatHistoryItemComponent = ({
  item,
  onDelete,
  showText,
}: ChatHistoryItemComponentProps) => {
  const { chatId } = useParams();
  const isActive = chatId === item.id;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(item.id);
  };

  return (
    <div
      className={cn(
        'group relative flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent',
        isActive && 'bg-accent'
      )}
    >
      <Link to={`/chat/${item.id}`} className="flex flex-1 items-center gap-2 overflow-hidden">
        <MessageSquare className="h-4 w-4 flex-shrink-0" />
        {showText && (
          <span className="flex-1 truncate" title={item.title}>
            {item.title}
          </span>
        )}
      </Link>

      {showText && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
