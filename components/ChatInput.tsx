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
    <div className="border-top bg-white p-2 p-sm-3 position-relative" style={{ boxShadow: '0 -2px 8px rgba(0,0,0,0.03)' }}>
      <form onSubmit={handleSubmit} className="w-100">
        <div className="row gx-2 align-items-end flex-nowrap">
          <div className="col-12 col-sm">
            <div className="form-check mb-2">
              <input
                className="form-check-input"
                type="checkbox"
                id="generateImage"
                checked={generateImage}
                onChange={(e) => setGenerateImage(e.target.checked)}
                disabled={isLoading}
              />
              <label className="form-check-label small" htmlFor="generateImage">
                <Image size={16} className="me-1" />
                Generate Image Description
              </label>
            </div>
            <div className="input-group flex-nowrap">
              <textarea
                className="form-control rounded-3"
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
                style={{ resize: 'none', minHeight: 44, fontSize: 16 }}
                disabled={isLoading}
              />
              <button
                className="btn btn-primary d-flex align-items-center justify-content-center ms-2 px-3"
                type="submit"
                disabled={!message.trim() || isLoading}
                style={{ minHeight: 44 }}
              >
                {isLoading ? (
                  <div className="spinner-border spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}