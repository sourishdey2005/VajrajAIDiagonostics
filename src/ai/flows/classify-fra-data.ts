'use server';
/**
 * @fileOverview This file defines a Genkit flow for classifying transformer fault data.
 *
 * - classifyFraData - A function that takes raw file data and returns a fault classification.
 * - ClassifyFraDataInput - The input type for the classifyFraData function.
 * - ClassifyFraDataOutput - The output type for the classifyFraData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyFraDataInputSchema = z.object({
  fileData: z.string().describe('The raw text content of the FRA data file.'),
  transformerId: z.string(),
  criticality: z.string(),
});
export type ClassifyFraDataInput = z.infer<typeof ClassifyFraDataInputSchema>;

const ClassifyFraDataOutputSchema = z.object({
  faultClassification: z.string().describe('The determined fault classification.'),
  confidenceScore: z
    .number()
    .describe('The confidence score (0-1) for the classification.'),
  rawFraDataSummary: z
    .string()
    .describe('A brief, technical summary of the raw data that led to the classification.'),
});
export type ClassifyFraDataOutput = z.infer<typeof ClassifyFraDataOutputSchema>;

export async function classifyFraData(
  input: ClassifyFraDataInput
): Promise<ClassifyFraDataOutput> {
  return classifyFraDataFlow(input);
}

const possibleFaults = [
  'Winding Deformation',
  'Axial Displacement',
  'Core Fault',
  'Bushing Fault',
  'No Fault Detected',
  'Inter-turn Short',
];

const prompt = ai.definePrompt({
  name: 'classifyFraDataPrompt',
  input: {schema: ClassifyFraDataInputSchema},
  output: {schema: ClassifyFraDataOutputSchema},
  prompt: `You are a transformer fault diagnosis expert. Your task is to analyze the provided Frequency Response Analysis (FRA) data and determine the most likely fault.

Analyze the following data for transformer with ID {{{transformerId}}} and criticality level {{{criticality}}}.

Data:
\`\`\`
{{{fileData}}}
\`\`\`

Based on the data, select the most appropriate fault classification from the following list: ${possibleFaults.join(
    ', '
  )}.

Provide a realistic confidence score between 0.70 and 0.98.

Also, generate a concise, one-sentence technical summary of why you made this classification, referencing specific frequency ranges or impedance mismatches from the data.
`,
});

const classifyFraDataFlow = ai.defineFlow(
  {
    name: 'classifyFraDataFlow',
    inputSchema: ClassifyFraDataInputSchema,
    outputSchema: ClassifyFraDataOutputSchema,
  },
  async input => {
    // In a real-world scenario, you might have more complex logic here
    // to pre-process the data before sending it to the model.
    const {output} = await prompt(input);
    return output!;
  }
);
