'use server';
/**
 * @fileOverview This file defines a Genkit flow to determine the angle for the Health Compass visualization.
 *
 * - getHealthCompassReading - A function that takes a fault classification and returns an angle.
 * - GetHealthCompassReadingInput - The input type for the function.
 * - GetHealthCompassReadingOutput - The output type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetHealthCompassReadingInputSchema = z.object({
  faultClassification: z.string().describe('The classification of the fault detected.'),
});
export type GetHealthCompassReadingInput = z.infer<typeof GetHealthCompassReadingInputSchema>;

const GetHealthCompassReadingOutputSchema = z.object({
  angle: z.number().min(0).max(360).describe("The angle for the compass pointer, from 0 to 360 degrees."),
});
export type GetHealthCompassReadingOutput = z.infer<typeof GetHealthCompassReadingOutputSchema>;

export async function getHealthCompassReading(input: GetHealthCompassReadingInput): Promise<GetHealthCompassReadingOutput> {
  return getHealthCompassReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getHealthCompassReadingPrompt',
  input: {schema: GetHealthCompassReadingInputSchema},
  output: {schema: GetHealthCompassReadingOutputSchema},
  prompt: `You are a transformer fault diagnostics expert. Your task is to map a fault classification to a specific category represented by an angle on a compass.

The compass directions are:
- North (0/360 degrees): Mechanical Fault Risk (e.g., Winding Deformation, Axial Displacement)
- East (90 degrees): Core Issue Risk (e.g., Core Fault)
- South (180 degrees): Winding Damage (e.g., Inter-turn Short)
- West (270 degrees): Thermal/Insulation Issue (e.g., Bushing Fault)

If a fault classification could fit between two categories, choose an angle in between.
If no specific fault is detected, the angle should be 0.

Based on the given fault classification, determine the angle for the health compass pointer.

Fault Classification: {{{faultClassification}}}
`,
});

const getHealthCompassReadingFlow = ai.defineFlow(
  {
    name: 'getHealthCompassReadingFlow',
    inputSchema: GetHealthCompassReadingInputSchema,
    outputSchema: GetHealthCompassReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
