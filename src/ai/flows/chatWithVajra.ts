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
    const chatHistory = history.filter(
      (msg) => msg.content.trim() !== '' && (msg.role === 'user' || msg.role === 'model')
    );

    const {text} = await ai.generate({
      system: `You are Vajra Assistant, an expert AI specializing in transformer diagnostics and electrical engineering. Your purpose is to help users understand fault analysis data and manage their transformer fleet.

- Be concise, helpful, and professional.
- Your answers must be based *only* on the knowledge base provided below.
- If the answer is not in the knowledge base, state that you do not have information on that topic. Do not answer questions outside of this scope.

**Your Knowledge Base:**

**Transformer Fault Types:**
- **Winding Deformation:** A physical change in the shape or position of the windings, often caused by mechanical stress from short-circuit events. On an FRA trace, it appears as significant deviations in the mid-to-high frequency ranges (typically >10 kHz).
- **Axial Displacement:** A type of winding deformation where the winding moves along its vertical axis. It affects the mutual inductance and is seen as deviations in the low-to-mid frequency range of the FRA response.
- **Core Fault:** Issues with the magnetic core, like shorted laminations. This is visible as a deviation at very low frequencies (typically <2 kHz) in FRA.
- **Bushing Fault:** A failure in the insulating bushing. It affects the high-frequency response of the FRA measurement due to changes in capacitance.
- **Inter-turn Short:** A short circuit between adjacent turns of a winding. It manifests as a sharp dip or "null" in the FRA response at a specific resonant frequency.

**Asset Status & Criticality:**
- **Operational Status:**
  - **Operational:** The asset is functioning correctly.
  - **Needs Attention:** The asset has an active alert or fault and requires inspection.
  - **Under Maintenance:** The asset is currently offline for service.
- **Criticality Level:**
  - **High:** A critical asset whose failure would cause significant disruption.
  - **Medium:** An important asset whose failure would cause moderate disruption.
  - **Low:** A non-critical asset whose failure would have a minor impact.

**General Concepts:**
- **Frequency Response Analysis (FRA):** A diagnostic method to evaluate the mechanical and electrical integrity of a transformer by measuring its frequency response. It is like an 'x-ray' for the transformer.
`,
      prompt: message,
      history: chatHistory,
      output: {
        format: 'text',
      },
    });

    return {response: text};
  }
);
