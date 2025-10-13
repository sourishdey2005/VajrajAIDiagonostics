'use server';
/**
 * @fileOverview Generates actionable maintenance suggestions based on fault classification results.
 *
 * - generateActionableInsights - A function that generates actionable maintenance suggestions.
 * - GenerateActionableInsightsInput - The input type for the generateActionableInsights function.
 * - GenerateActionableInsightsOutput - The return type for the generateActionableInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateActionableInsightsInputSchema = z.object({
  faultClassification: z
    .string()
    .describe("The classification of the fault detected in the transformer."),
  confidenceScore: z
    .number()
    .describe("The confidence score associated with the fault classification."),
  criticality: z
    .string()
    .describe("The criticality level of the transformer (e.g., High, Medium, Low)."),
});
export type GenerateActionableInsightsInput = z.infer<
  typeof GenerateActionableInsightsInputSchema
>;

const GenerateActionableInsightsOutputSchema = z.object({
  actionableInsights: z
    .string()
    .describe("A concise summary of actionable maintenance suggestions."),
});
export type GenerateActionableInsightsOutput = z.infer<
  typeof GenerateActionableInsightsOutputSchema
>;

export async function generateActionableInsights(
  input: GenerateActionableInsightsInput
): Promise<GenerateActionableInsightsOutput> {
  return generateActionableInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateActionableInsightsPrompt',
  input: {schema: GenerateActionableInsightsInputSchema},
  output: {schema: GenerateActionableInsightsOutputSchema},
  prompt: `You are an expert in transformer maintenance and diagnostics. Based on the fault classification, confidence score, and transformer criticality level, provide a concise summary of actionable maintenance suggestions.

Fault Classification: {{{faultClassification}}}
Confidence Score: {{{confidenceScore}}}
Transformer Criticality Level: {{{criticality}}}

Actionable Maintenance Suggestions:`,
});

const generateActionableInsightsFlow = ai.defineFlow(
  {
    name: 'generateActionableInsightsFlow',
    inputSchema: GenerateActionableInsightsInputSchema,
    outputSchema: GenerateActionableInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
