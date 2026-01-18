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
import { useState } from 'react';

interface ChatHistoryItemComponentProps {
  item: {
    id: string;
    title: string;
    preview?: string;
  };
  onDelete?: (chatId: string) => void;
  showText: boolean;
  index?: number;
}

export const ChatHistoryItemComponent = ({
  item,
  onDelete,
  showText,
  index = 0,
}: ChatHistoryItemComponentProps) => {
  const { chatId } = useParams();
  const [isHovered, setIsHovered] = useState(false);
  const isActive = chatId === item.id;

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(item.id);
  };

  return (
    <div
      className="animate-in fade-in slide-in-from-left-2 duration-300"
      style={{ animationDelay: `${index * 50}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={cn(
          'group relative flex items-center justify-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300',
          isActive
            ? 'bg-primary/15 text-primary shadow-sm shadow-primary/10'
            : 'hover:bg-accent/50',
          !showText && 'w-full min-w-[50px]'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-xl opacity-0 transition-opacity duration-300',
            isHovered && !isActive && 'opacity-100'
          )}
        />

        <Link
          to={`/chat/${item.id}`}
          className={cn(
            'relative z-10 flex items-center overflow-hidden',
            showText ? 'flex-1 gap-3 min-w-0' : 'justify-center'
          )}
        >
          <div className={cn('flex-shrink-0 transition-all duration-300')}>
            <MessageSquare
              className={cn(
                'h-4 w-4 transition-all duration-300',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground group-hover:text-foreground group-hover:scale-110'
              )}
            />
          </div>

          {showText && (
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'font-medium truncate transition-colors duration-200',
                  isActive ? 'text-primary' : 'text-foreground group-hover:text-foreground'
                )}
                title={item.title}
              >
                {item.title}
              </p>
              {item.preview && (
                <p className="text-xs text-muted-foreground truncate mt-0.5">{item.preview}</p>
              )}
            </div>
          )}
        </Link>

        {showText && (
          <div
            className={cn(
              'relative z-10 flex items-center transition-all duration-200',
              isHovered || isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            )}
          >
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-lg hover:bg-accent transition-all duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete chat
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full animate-in slide-in-from-left-1 duration-300" />
        )}
      </div>
    </div>
  );
};
