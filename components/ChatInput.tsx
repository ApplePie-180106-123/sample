'use client';

import { useState } from 'react';
import { Send, Image } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, generateImage?: boolean) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [generateImage, setGenerateImage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim(), generateImage);
      setMessage('');
      setGenerateImage(false);
    }
  };

  return (
    <div className="border-top bg-white p-3">
      <form onSubmit={handleSubmit}>
        <div className="row align-items-end">
          <div className="col">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="generateImage"
                checked={generateImage}
                onChange={(e) => setGenerateImage(e.target.checked)}
                disabled={isLoading}
              />
              <label className="form-check-label" htmlFor="generateImage">
                <Image size={16} className="me-1" />
                Generate Image Description
              </label>
            </div>
            <div className="input-group">
              <textarea
                className="form-control"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                rows={1}
                style={{ resize: 'none' }}
                disabled={isLoading}
              />
              <button
                className="btn btn-primary"
                type="submit"
                disabled={!message.trim() || isLoading}
              >
                {isLoading ? (
                  <div className="spinner-border spinner-border-sm\" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}