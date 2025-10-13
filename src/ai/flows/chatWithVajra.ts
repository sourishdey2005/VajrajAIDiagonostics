'use server';
/**
 * @fileOverview A conversational AI flow for the Vajra Assistant chatbot.
 *
 * - chatWithVajra - A function that handles the chatbot conversation.
 * - ChatWithVajraInput - The input type for the function.
 * - ChatWithVajraOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatWithVajraInputSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string(),
});
export type ChatWithVajraInput = z.infer<typeof ChatWithVajraInputSchema>;

const ChatWithVajraOutputSchema = z.object({
  response: z.string(),
});
export type ChatWithVajraOutput = z.infer<typeof ChatWithVajraOutputSchema>;

export async function chatWithVajra(
  input: ChatWithVajraInput
): Promise<ChatWithVajraOutput> {
  return chatWithVajraFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatWithVajraPrompt',
  input: {schema: ChatWithVajraInputSchema},
  output: {schema: ChatWithVajraOutputSchema},
  system: `You are Vajra Assistant, an expert AI specializing in transformer diagnostics and electrical engineering. Your purpose is to help users understand fault analysis data and manage their transformer fleet.

  - Be concise, helpful, and professional.
  - If you don't know the answer, say so.
  - Your knowledge base is limited to the context of transformer maintenance, Frequency Response Analysis (FRA), and general electrical engineering principles.
  - Do not answer questions outside of this scope. If a user asks about something unrelated, politely decline.
  `,
  prompt: `Answer the user's question based on the provided history and your expertise.

  User's Question: {{{message}}}
  `,
});

const chatWithVajraFlow = ai.defineFlow(
  {
    name: 'chatWithVajraFlow',
    inputSchema: ChatWithVajraInputSchema,
    outputSchema: ChatWithVajraOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
