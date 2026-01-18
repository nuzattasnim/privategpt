import { Button } from '@/components/ui-kit/button';
import { PenSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NewChatButtonProps {
  onNewChat?: (chatId: string) => void;
}

/**
 * NewChatButton Component
 *
 * Button to create a new chat session
 */
export const NewChatButton = ({ onNewChat }: NewChatButtonProps) => {
  const navigate = useNavigate();

  const handleNewChat = () => {
    // Navigate to base chat route for new chat
    navigate('/chat');
    onNewChat?.(crypto.randomUUID());
  };

  return (
    <Button
      onClick={handleNewChat}
      variant="outline"
      className="w-full justify-start gap-2 mb-2"
      size="default"
    >
      <PenSquare className="h-4 w-4" />
      <span>New Chat</span>
    </Button>
  );
};
