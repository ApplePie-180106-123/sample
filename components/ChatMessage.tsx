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
    <div className={`d-flex mb-3 ${isUser ? 'justify-content-end' : 'justify-content-start'}`}
      style={{ width: '100%' }}>
      <div className={`d-flex ${isUser ? 'flex-row-reverse' : 'flex-row'} align-items-end gap-2 gap-sm-3`}
        style={{ maxWidth: '80vw', width: 'fit-content', minWidth: 0 }}>
        <div className="flex-shrink-0">
          {isUser ? (
            userPicture ? (
              <img
                src={userPicture}
                alt="User"
                width={36}
                height={36}
                className="rounded-circle border"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
                <User size={18} />
              </div>
            )
          ) : (
            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 36, height: 36 }}>
              AI
            </div>
          )}
        </div>
        <div
          className={`${isUser ? 'bg-primary text-white' : 'bg-light'} p-2 p-sm-3 rounded-3 shadow-sm`}
          style={{
            display: 'inline-block',
            maxWidth: 320,
            minWidth: 40,
            wordBreak: 'break-word',
            width: 'fit-content',
            fontSize: 16,
            marginLeft: isUser ? 0 : 4,
            marginRight: isUser ? 4 : 0,
          }}
        >
          {isImage ? (
            <img src={content} alt="Generated preview" className="img-fluid rounded mb-2 w-100" style={{ maxWidth: 240, height: 'auto' }} />
          ) : (
            <ReactMarkdown
              components={{
                p: ({ node, ...props }) => (
                  <p {...props} className="mb-0" style={{ whiteSpace: 'pre-wrap', fontSize: 16 }} />
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