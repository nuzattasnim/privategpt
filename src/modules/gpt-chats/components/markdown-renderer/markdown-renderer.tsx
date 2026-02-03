import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { MarkdownComponentsMap } from './markdown-components-map';

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

const JsonSkeletonBlock = ({ content }: { content: string }) => {
  const lineCount = content.split('\n').length;
  const height = Math.min(Math.max(lineCount * 20 + 16, 80), 400);

  return (
    <div
      className="my-2 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700 bg-[#F8F9FA] dark:bg-[#1E1E1E] w-full"
      style={{ height: `${height}px` }}
    >
      <div className="flex h-full">
        <div
          className="flex-shrink-0 bg-[#F8F9FA] dark:bg-[#1E1E1E] text-gray-300 dark:text-gray-700 text-right select-none"
          style={{
            width: '48px',
            paddingTop: '8px',
            paddingRight: '8px',
            fontSize: '13px',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            lineHeight: '20px',
          }}
        >
          {content.split('\n').map((_, index) => (
            <div key={index}>{index + 1}</div>
          ))}
        </div>

        <div className="flex-1 relative overflow-hidden" style={{ padding: '8px' }}>
          <pre
            className="text-gray-300 dark:text-gray-600 whitespace-pre-wrap m-0 opacity-60"
            style={{
              fontSize: '13px',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              lineHeight: '20px',
            }}
          >
            {content}
          </pre>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite linear',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

const ImageSkeletonBlock = ({ content }: { content: string }) => {
  return (
    <div className="my-4 w-full max-w-lg">
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div className="aspect-square w-full relative overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s infinite linear',
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-400 dark:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>

        <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600 dark:text-gray-400">{content}</span>
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
                style={{ animationDelay: '0s' }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

export const MarkdownRenderer = ({ content, className = '' }: MarkdownRendererProps) => {
  const jsonBlockRegex = /:::(json|json-skeleton|image-skeleton)\n([\s\S]*?)\n:::/g;
  const hasJsonBlock = jsonBlockRegex.test(content);

  if (hasJsonBlock) {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    jsonBlockRegex.lastIndex = 0;

    while ((match = jsonBlockRegex.exec(content)) !== null) {
      const blockType = match[1];
      const blockContent = match[2];

      if (match.index > lastIndex) {
        const textBefore = content.slice(lastIndex, match.index);
        if (textBefore.trim()) {
          parts.push(
            <ReactMarkdown
              key={`text-${lastIndex}`}
              remarkPlugins={[remarkGfm]}
              components={MarkdownComponentsMap}
            >
              {textBefore}
            </ReactMarkdown>
          );
        }
      }

      if (blockType === 'image-skeleton') {
        parts.push(
          <ImageSkeletonBlock key={`image-skeleton-${match.index}`} content={blockContent} />
        );
      } else {
        parts.push(<JsonSkeletonBlock key={`skeleton-${match.index}`} content={blockContent} />);
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      const textAfter = content.slice(lastIndex);
      if (textAfter.trim()) {
        parts.push(
          <ReactMarkdown
            key={`text-${lastIndex}`}
            remarkPlugins={[remarkGfm]}
            components={MarkdownComponentsMap}
          >
            {textAfter}
          </ReactMarkdown>
        );
      }
    }

    return (
      <div
        className={cn(
          'prose prose-sm max-w-none dark:prose-invert',
          'prose-headings:font-semibold',
          'prose-p:leading-relaxed prose-p:p-0 prose-p:m-0',
          'prose-ol:list-decimal prose-ul:list-disc prose-ul:p-0',
          'prose-li:p-0 prose-li:m-0',

          'prose-pre:bg-transparent prose-pre:p-0',
          className
        )}
      >
        {parts}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'prose max-w-none dark:prose-invert',
        'prose-headings:font-semibold',
        'prose-h1:mb-3',
        'prose-h2:my-3',
        'prose-p:leading-relaxed prose-p:p-0 prose-p:m-0',
        'prose-ol:list-decimal prose-ul:list-disc prose-ul:p-0',
        'prose-pre:p-0 prose-pre:m-0',
        'prose-li:p-0 prose-li:m-0',
        className
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MarkdownComponentsMap}>
        {content}
      </ReactMarkdown>
    </div>
  );
};
