'use client';

import { User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  userPicture?: string;
}

export function ChatMessage({ role, content, userPicture }: ChatMessageProps) {
  const isUser = role === 'user';

  // Helper: check if content is a valid image URL (support .webp and signed URLs)
  const isImage = typeof content === 'string' &&
    (content.startsWith('http://') || content.startsWith('https://')) &&
    (/\.(png|jpg|jpeg|webp)(\?|$)/i.test(content));

  return (
    <div className={`d-flex mb-4 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}>
      <div className={`d-flex ${isUser ? 'flex-row-reverse' : 'flex-row'} align-items-start gap-3`}>
        <div className="flex-shrink-0">
          {isUser ? (
            userPicture ? (
              <img
                src={userPicture}
                alt="User"
                width={40}
                height={40}
                className="rounded-circle"
              />
            ) : (
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                <User size={20} />
              </div>
            )
          ) : (
            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
              AI
            </div>
          )}
        </div>
        <div className={`${isUser ? 'bg-primary text-white' : 'bg-light'} p-3 rounded-3 shadow-sm`} style={{ maxWidth: '70%' }}>
          {isImage ? (
            <img src={content} alt="Generated preview" className="img-fluid rounded mb-2" style={{ maxWidth: '100%', height: 'auto' }} />
          ) : (
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p {...props} className="mb-0" style={{ whiteSpace: 'pre-wrap' }} />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}