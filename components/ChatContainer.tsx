'use client';

import { useEffect, useRef, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { trpc } from '@/lib/trpc-client';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

export function ChatContainer({ resetSignal, chatId }: { resetSignal?: number, chatId: string }) {
  const { user } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: messages, refetch } = trpc.getMessages.useQuery(
    { userId: user?.sub || '', chatId },
    { enabled: !!user?.sub && !!chatId }
  );

  const sendMessageMutation = trpc.sendMessage.useMutation({
    onSuccess: () => {
      refetch();
      setIsLoading(false);
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      setIsLoading(false);
    },
  });

  const handleSendMessage = async (content: string, generateImage = false) => {
    if (!user?.sub || !chatId) return;

    setIsLoading(true);
    try {
      console.log('Sending message:', { userId: user.sub, chatId, content, generateImage });
      const response = await sendMessageMutation.mutateAsync({
        userId: user.sub,
        chatId,
        content,
        generateImage,
      });
      console.log('sendMessage response:', response);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (resetSignal !== undefined) {
      refetch();
    }
  }, [resetSignal]);

  // Refetch messages after sending a message
  useEffect(() => {
    if (sendMessageMutation.isSuccess) {
      refetch();
    }
  }, [sendMessageMutation.isSuccess, refetch]);

  // Refetch messages when chatId changes
  useEffect(() => {
    if (chatId) {
      refetch();
    }
  }, [chatId, refetch]);

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="text-center">
          <h2>Welcome to ChatGPT Clone</h2>
          <p className="text-muted">Please log in to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column h-100">
      <div className="flex-grow-1 overflow-auto p-4">
        {(!messages || messages.length === 0) ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <div className="text-center">
              <h3>Start a conversation</h3>
              <p className="text-muted">Send a message to begin chatting with AI</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                userPicture={user.picture || undefined}
              />
            ))}
            {isLoading && (
              <div className="d-flex justify-content-start mb-4">
                <div className="d-flex align-items-start gap-3">
                  <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                    AI
                  </div>
                  <div className="bg-light p-3 rounded-3 shadow-sm">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="ms-2 text-muted">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}