// src/ai/flows/suggest-expert-system-rules.ts
'use server';
/**
 * @fileOverview An expert system rules suggestion AI agent.
 *
 * - suggestExpertSystemRules - A function that suggests expert system rules.
 * - SuggestExpertSystemRulesInput - The input type for the suggestExpertSystemRules function.
 * - SuggestExpertSystemRulesOutput - The return type for the suggestExpertSystemRules function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestExpertSystemRulesInputSchema = z.object({
  faultClassification: z
    .string()
    .describe('The classification of the fault detected in the transformer.'),
  confidenceScore: z
    .number()
    .describe(
      'The confidence score associated with the fault classification (0-1).' ),
  transformerCriticalityLevel: z
    .string()
    .describe(
      'The criticality level of the transformer (e.g., High, Medium, Low).'
    ),
});
export type SuggestExpertSystemRulesInput = z.infer<
  typeof SuggestExpertSystemRulesInputSchema
>;

const SuggestExpertSystemRulesOutputSchema = z.object({
  suggestedRules: z
    .string()
    .describe(
      'Suggested expert system rules in JSON format based on the input data.'
    ),
});
export type SuggestExpertSystemRulesOutput = z.infer<
  typeof SuggestExpertSystemRulesOutputSchema
>;

export async function suggestExpertSystemRules(
  input: SuggestExpertSystemRulesInput
): Promise<SuggestExpertSystemRulesOutput> {
  return suggestExpertSystemRulesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestExpertSystemRulesPrompt',
  input: {schema: SuggestExpertSystemRulesInputSchema},
  output: {schema: SuggestExpertSystemRulesOutputSchema},
  prompt: `You are an expert system designer specializing in creating rules for transformer fault diagnostics.

  Based on the fault classification, confidence score, and transformer criticality level, suggest expert system rules in JSON format.

  Fault Classification: {{{faultClassification}}}
  Confidence Score: {{{confidenceScore}}}
  Transformer Criticality Level: {{{transformerCriticalityLevel}}}

  The suggested rules should include conditions based on the inputs and corresponding maintenance suggestions.
  Ensure the output is a valid JSON format. The top-level element of the JSON should be an array of rules.

  Example output:
  [
    {
      "condition": "faultClassification === 'Axial Displacement' && confidenceScore > 0.8 && transformerCriticalityLevel === 'High'",
      "maintenanceSuggestion": "Immediately inspect the transformer for mechanical damage and schedule an outage for detailed assessment."
    },
    {
      "condition": "faultClassification === 'Winding Deformation' && confidenceScore > 0.6 && transformerCriticalityLevel === 'Medium'",
      "maintenanceSuggestion": "Perform detailed FRA analysis and DGA to confirm the winding deformation and plan for repair or replacement."
    }
  ]
  `,
});

const suggestExpertSystemRulesFlow = ai.defineFlow(
  {
    name: 'suggestExpertSystemRulesFlow',
    inputSchema: SuggestExpertSystemRulesInputSchema,
    outputSchema: SuggestExpertSystemRulesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
