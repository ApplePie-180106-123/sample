'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { trpc } from '@/lib/trpc-client';
import { Navbar } from '@/components/Navbar';
import { ChatContainer } from '@/components/ChatContainer';
import { v4 as uuidv4 } from 'uuid';

export default function Home() {
  const { user, isLoading } = useUser();
  const upsertUserMutation = trpc.upsertUser.useMutation();
  const [resetSignal, setResetSignal] = useState(0);
  const [chatId, setChatId] = useState(() => uuidv4());

  useEffect(() => {
    if (user && user.sub) {
      upsertUserMutation.mutate({
        id: user.sub,
        email: user.email || '',
        name: user.name || undefined,
        picture: user.picture || undefined,
      });
    }
  }, [user]);

  const handleNewChat = () => {
    setChatId(uuidv4());
    setResetSignal((v) => v + 1);
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar onNewChat={handleNewChat} />
      <main className="flex-grow-1 d-flex flex-column w-100 mx-auto" style={{ maxWidth: 600 }}>
        <ChatContainer resetSignal={resetSignal} chatId={chatId} />
      </main>
    </div>
  );
}