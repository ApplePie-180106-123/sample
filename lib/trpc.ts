import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';
import superjson from 'superjson';
import { supabase } from './supabase';
import { generateTextResponseWithChat, generateImageResponse, generateImageWithReplicate } from './gemini';

const t = initTRPC.create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  getMessages: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('user_id', input.userId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Supabase error:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to fetch messages',
          });
        }

        return data || [];
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch messages',
        });
      }
    }),

  sendMessage: publicProcedure
    .input(z.object({
      userId: z.string(),
      content: z.string(),
      generateImage: z.boolean().optional().default(false),
    }))
    .mutation(async ({ input }) => {
      try {
        // Save user message
        const { error: userMessageError } = await supabase
          .from('messages')
          .insert({
            user_id: input.userId,
            role: 'user',
            content: input.content,
          });

        if (userMessageError) {
          console.error('Error saving user message:', userMessageError);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to save user message',
          });
        }

        // Generate AI response using Gemini chat/session
        let aiResponse: string;
        try {
          if (input.generateImage) {
            aiResponse = await generateImageWithReplicate(input.content);
          } else {
            aiResponse = await generateTextResponseWithChat(input.userId, input.content);
          }
        } catch (error) {
          console.error('Error generating AI response:', error);
          aiResponse = 'I apologize, but I encountered an error while generating a response. Please try again.';
        }

        // Save AI response
        const { error: aiMessageError } = await supabase
          .from('messages')
          .insert({
            user_id: input.userId,
            role: 'assistant',
            content: aiResponse,
          });

        if (aiMessageError) {
          console.error('Error saving AI message:', aiMessageError);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to save AI message',
          });
        }

        return { success: true, response: aiResponse };
      } catch (error) {
        console.error('Error in sendMessage:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to process message',
        });
      }
    }),

  upsertUser: publicProcedure
    .input(z.object({
      id: z.string(),
      email: z.string(),
      name: z.string().optional(),
      picture: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        const { error } = await supabase
          .from('users')
          .upsert({
            id: input.id,
            email: input.email,
            name: input.name || null,
            picture: input.picture || null,
          }, {
            onConflict: 'id'
          });

        if (error) {
          console.error('Error upserting user:', error);
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to upsert user',
          });
        }

        return { success: true };
      } catch (error) {
        console.error('Error in upsertUser:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upsert user',
        });
      }
    }),
});

export type AppRouter = typeof appRouter;