'use client';

import { useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import { trpc } from '@/lib/trpc-client';
import { Navbar } from '@/components/Navbar';
import { ChatContainer } from '@/components/ChatContainer';

export default function Home() {
  const { user, isLoading } = useUser();

  const upsertUserMutation = trpc.upsertUser.useMutation();

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
    <div className="vh-100 d-flex flex-column">
      <Navbar />
      <main className="flex-grow-1 d-flex flex-column">
        <ChatContainer />
      </main>
    </div>
  );
}