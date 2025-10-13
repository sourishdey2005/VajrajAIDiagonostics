'use server';
/**
 * @fileOverview This file defines a Genkit flow to augment the dashboard with AI-generated explanations of fault analysis results.
 *
 * - augmentDashboardWithAIExplanations - A function that takes fault analysis results and returns AI-generated explanations.
 * - AugmentDashboardInput - The input type for the augmentDashboardWithAIExplanations function, representing fault analysis results.
 * - AugmentDashboardOutput - The output type for the augmentDashboardWithAIExplanations function, containing AI-generated explanations.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AugmentDashboardInputSchema = z.object({
  faultClassification: z.string().describe('The classification of the fault detected.'),
  confidenceScore: z.number().describe('The confidence score of the fault classification.'),
  rawFraDataSummary: z.string().describe('Summary of the raw FRA data that led to the classification.'),
});
export type AugmentDashboardInput = z.infer<typeof AugmentDashboardInputSchema>;

const AugmentDashboardOutputSchema = z.object({
  aiExplanation: z.string().describe('An AI-generated explanation of the fault analysis results.'),
});
export type AugmentDashboardOutput = z.infer<typeof AugmentDashboardOutputSchema>;

export async function augmentDashboardWithAIExplanations(input: AugmentDashboardInput): Promise<AugmentDashboardOutput> {
  return augmentDashboardWithAIExplanationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'augmentDashboardWithAIExplanationsPrompt',
  input: {schema: AugmentDashboardInputSchema},
  output: {schema: AugmentDashboardOutputSchema},
  prompt: `You are an AI assistant that provides explanations of fault analysis results for a transformer diagnostic tool.

  Given the following fault analysis results, generate a concise and easy-to-understand explanation that can be communicated to both technical and non-technical stakeholders.

  Fault Classification: {{{faultClassification}}}
  Confidence Score: {{{confidenceScore}}}
  Raw FRA Data Summary: {{{rawFraDataSummary}}}

  AI Explanation:`,
});

const augmentDashboardWithAIExplanationsFlow = ai.defineFlow(
  {
    name: 'augmentDashboardWithAIExplanationsFlow',
    inputSchema: AugmentDashboardInputSchema,
    outputSchema: AugmentDashboardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
