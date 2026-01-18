import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui-kit/button';
import { Textarea } from '@/components/ui-kit/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui-kit/select';
import {
  Sparkles,
  Compass,
  Code,
  GraduationCap,
  Search,
  Paperclip,
  ArrowUp,
  Mic,
  Plus,
  Globe,
  FileImage,
  Video,
  Zap,
  Lightbulb,
  Database,
  BookOpen,
  LucideIcon,
  Paintbrush,
  MapPin,
} from 'lucide-react';

const categoryPrompts: Record<
  string,
  Array<{ icon: LucideIcon; title: string; description: string }>
> = {
  create: [
    {
      icon: Paintbrush,
      title: 'Design a landing page',
      description: 'for a sustainable fashion brand',
    },
    {
      icon: Sparkles,
      title: 'Write a creative story',
      description: 'about time travel and friendship',
    },
    {
      icon: Zap,
      title: 'Generate marketing copy',
      description: 'for a new AI productivity tool',
    },
    {
      icon: Lightbulb,
      title: 'Brainstorm startup ideas',
      description: 'in the climate tech space',
    },
  ],
  explore: [
    {
      icon: MapPin,
      title: 'Plan a 2-week trip',
      description: 'to Japan with cultural highlights',
    },
    {
      icon: Compass,
      title: 'Discover hidden gems',
      description: 'in European architecture',
    },
    {
      icon: Globe,
      title: 'Compare different cultures',
      description: 'approach to work-life balance',
    },
    {
      icon: Sparkles,
      title: 'Explore future trends',
      description: 'in renewable energy',
    },
  ],
  code: [
    {
      icon: Code,
      title: 'Build a REST API',
      description: 'with Node.js and Express',
    },
    {
      icon: Database,
      title: 'Optimize SQL queries',
      description: 'for better performance',
    },
    {
      icon: Zap,
      title: 'Debug React component',
      description: 'with rendering issues',
    },
    {
      icon: Code,
      title: 'Implement authentication',
      description: 'using JWT and refresh tokens',
    },
  ],
  learn: [
    {
      icon: GraduationCap,
      title: "Beginner's guide to TypeScript",
      description: 'with practical examples',
    },
    {
      icon: BookOpen,
      title: 'Explain the CAP theorem',
      description: 'in distributed systems',
    },
    {
      icon: Lightbulb,
      title: 'Why is AI so expensive?',
      description: 'Break down the costs',
    },
    {
      icon: Sparkles,
      title: 'Are black holes real?',
      description: 'Explore the science behind them',
    },
  ],
};

const categories = [
  { id: 'create', label: 'Create', icon: Sparkles },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'code', label: 'Code', icon: Code },
  { id: 'learn', label: 'Learn', icon: GraduationCap },
];

export const GptChatPage = () => {
  const { chatId } = useParams();
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('learn');
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash');

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePromptClick = (prompt: { title: string; description: string }) => {
    setMessage(`${prompt.title} ${prompt.description}`);
  };

  const isNewChat = !chatId;

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-background to-muted/20">
      {isNewChat ? (
        /* Welcome Screen */
        <div className="flex-1 flex flex-col items-center justify-center px-4 max-w-5xl mx-auto w-full py-8">
          <div className="text-center mb-12 space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold  bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              How can I help you today?
            </h1>
            <p className="text-muted-foreground text-lg">Choose a category to get started</p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-3 mb-10">
            {categories.map((category) => {
              const Icon = category.icon;
              const isActive = selectedCategory === category.id;
              return (
                <Button
                  key={category.id}
                  variant={isActive ? 'default' : 'outline'}
                  size="default"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`gap-2 px-6 py-5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 scale-105'
                      : 'bg-card/50 hover:bg-accent border-2 hover:border-primary/50 hover:scale-105'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </Button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl mb-8">
            {categoryPrompts[selectedCategory].map((prompt, index) => {
              const PromptIcon = prompt.icon;
              return (
                <button
                  key={index}
                  onClick={() => handlePromptClick(prompt)}
                  className="group relative overflow-hidden text-left p-5 rounded-2xl border-2 border-border bg-card/50 backdrop-blur-sm hover:bg-accent/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110">
                      <PromptIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {prompt.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {prompt.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-medium-emphasis py-8">
              <p>Chat conversation for ID: {chatId}</p>
              <p className="text-sm mt-2">Messages will appear here...</p>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-border/50 bg-gradient-to-b from-background/95 to-card/95 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="relative bg-card/80 backdrop-blur-sm rounded-3xl border-2 border-border hover:border-primary/30 focus-within:border-primary/50 transition-all duration-300 shadow-xl shadow-black/5">
            {/* Textarea */}
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything..."
              className="min-h-[80px] max-h-[200px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-16 px-6 py-5 text-base placeholder:text-muted-foreground/60"
            />

            {/* Send Button */}
            <div className="absolute bottom-[72px] right-4">
              <Button
                size="icon"
                className={`h-10 w-10 rounded-2xl transition-all duration-300 ${
                  message.trim()
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:scale-110'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
                onClick={handleSendMessage}
                disabled={!message.trim()}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>

            {/* Bottom Toolbar */}
            <div className="flex items-center justify-between px-6 pb-4 pt-2 border-t border-border/50">
              {/* Left Side - Model Selector & Tools */}
              <div className="flex items-center gap-2">
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-[180px] h-9 border-0 bg-muted/50 hover:bg-muted rounded-xl text-sm transition-colors">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-3-flash">Gemini 3 Flash</SelectItem>
                    <SelectItem value="deepseek-v3">deepseek-v3.1:671b</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                >
                  <Search className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                >
                  <Globe className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                >
                  <FileImage className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                >
                  <Video className="h-4 w-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-200 hover:scale-105"
                >
                  <Mic className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-center text-muted-foreground/70 mt-3">
            Press <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Enter</kbd> to send,{' '}
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded">Shift+Enter</kbd> for new line
          </p>
        </div>
      </div>
    </div>
  );
};
