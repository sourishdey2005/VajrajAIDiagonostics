'use server';
/**
 * @fileOverview A conversational AI flow for the Vajra Assistant chatbot.
 *
 * - chatWithVajra - A function that handles the chatbot conversation.
 * - ChatWithVajraInput - The input type for the function.
 * - ChatWithVajraOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {Message, z} from 'genkit';

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

const chatWithVajraFlow = ai.defineFlow(
  {
    name: 'chatWithVajraFlow',
    inputSchema: ChatWithVajraInputSchema,
    outputSchema: ChatWithVajraOutputSchema,
  },
  async ({history, message}) => {
    const systemPrompt = `You are Vajra Assistant, an expert AI specializing in transformer diagnostics and electrical engineering. Your purpose is to help users understand fault analysis data and manage their transformer fleet.

- Be concise, helpful, and professional.
- If you don't know the answer, say so.
- Your knowledge base is limited to the context of transformer maintenance, Frequency Response Analysis (FRA), and general electrical engineering principles.
- Do not answer questions outside of this scope. If a user asks about something unrelated, politely decline.

Your Knowledge Base on Transformer Faults:
- **Winding Deformation:** A physical change in the shape or position of the windings, often caused by mechanical stress from short-circuit events. It's a common and serious fault. On an FRA trace, it appears as significant deviations in the mid-to-high frequency ranges (typically >10 kHz) compared to the baseline, indicating changes in winding capacitance.
- **Axial Displacement:** A specific type of winding deformation where the winding moves up or down along its vertical axis. This is often caused by strong axial forces during external faults. It affects the mutual inductance between windings and can be seen as deviations in the low-to-mid frequency range of the FRA response.
- **Core Fault:** Issues related to the magnetic core, such as shorted laminations or mechanical deformation. Core issues primarily affect the magnetizing inductance of the transformer. In FRA, this is visible as a deviation at very low frequencies (typically <2 kHz).
- **Bushing Fault:** A failure in the insulating bushing, which connects the high-voltage winding to the external circuit. This often involves a partial or complete breakdown of the insulation. It primarily affects the high-frequency response of the FRA measurement due to changes in capacitance.
- **Inter-turn Short:** A short circuit between adjacent turns of the same winding. This creates a closed loop, drastically changing the winding's inductance. It's a severe fault that can lead to rapid overheating. It typically manifests as a significant downward shift (a "null" or sharp dip) in the FRA response at a specific resonant frequency, often in the mid-frequency range.
`;

    const chatHistory = history.filter(
      (msg) => msg.content.trim() !== '' && (msg.role === 'user' || msg.role === 'model')
    );

    const {text} = await ai.generate({
      prompt: message,
      history: [
        {role: 'user', content: systemPrompt},
        {role: 'model', content: "Understood. I am Vajra Assistant, ready to help."},
        ...chatHistory,
      ],
      output: {
        format: 'text',
      },
    });

    return {response: text};
  }
);
