'use server';
/**
 * @fileOverview This file defines a Genkit flow to determine the contributing factors to a transformer fault.
 *
 * - getContributingFactors - A function that takes fault analysis results and returns a list of contributing factors.
 * - GetContributingFactorsInput - The input type for the getContributingFactors function.
 * - GetContributingFactorsOutput - The output type for the getContributingFactors function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const GetContributingFactorsInputSchema = z.object({
  faultClassification: z.string().describe('The classification of the fault detected.'),
  rawFraDataSummary: z.string().describe('Summary of the raw FRA data that led to the classification.'),
   criticality: z.string().describe("The criticality level of the transformer."),
});
export type GetContributingFactorsInput = z.infer<typeof GetContributingFactorsInputSchema>;

const FactorSchema = z.object({
    factor: z.string().describe("A potential contributing factor to the fault."),
    influence: z.number().min(0).max(100).describe("The percentage of influence this factor has on the diagnosis (0-100). All influence scores must sum to 100.")
});

export const GetContributingFactorsOutputSchema = z.object({
  factors: z.array(FactorSchema).describe("A list of contributing factors and their influence scores.")
});
export type GetContributingFactorsOutput = z.infer<typeof GetContributingFactorsOutputSchema>;


export async function getContributingFactors(input: GetContributingFactorsInput): Promise<GetContributingFactorsOutput> {
  return getContributingFactorsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getContributingFactorsPrompt',
  input: {schema: GetContributingFactorsInputSchema},
  output: {schema: GetContributingFactorsOutputSchema},
  prompt: `You are a transformer diagnostics expert AI. Based on the fault analysis results, identify the most likely root causes or contributing factors.

Provide between 3 and 5 factors. The influence scores for all factors combined MUST sum up to exactly 100.

Fault Classification: {{{faultClassification}}}
Criticality: {{{criticality}}}
Data Summary: {{{rawFraDataSummary}}}

Generate a list of contributing factors and their influence as a percentage.
`,
});

const getContributingFactorsFlow = ai.defineFlow(
  {
    name: 'getContributingFactorsFlow',
    inputSchema: GetContributingFactorsInputSchema,
    outputSchema: GetContributingFactorsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
