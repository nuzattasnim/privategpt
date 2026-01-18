import { Button } from '@/components/ui-kit/button';
import { PenSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NewChatButtonProps {
  onNewChat?: (chatId: string) => void;
  showText?: boolean;
}

export const NewChatButton = ({ onNewChat, showText = true }: NewChatButtonProps) => {
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate('/chat');
    onNewChat?.(crypto.randomUUID());
  };

  return (
    <Button
      onClick={handleNewChat}
      variant={showText ? 'outline' : 'ghost'}
      className={`mb-2 justify-start gap-2 ${
        showText ? 'w-full' : 'w-full min-w-[48px] justify-center'
      }`}
      size="default"
    >
      <PenSquare className="h-4 w-4" />
      {showText && <span>New Chat</span>}
    </Button>
  );
};
