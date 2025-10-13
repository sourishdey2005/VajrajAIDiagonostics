'use server';
/**
 * @fileOverview A Genkit flow to estimate maintenance costs for transformer faults.
 *
 * - estimateMaintenanceCosts - A function that estimates costs based on fault type and criticality.
 * - EstimateMaintenanceCostsInput - The input type for the function.
 * - EstimateMaintenanceCostsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EstimateMaintenanceCostsInputSchema = z.object({
  faultClassification: z.string().describe('The classification of the fault detected.'),
  criticality: z.string().describe('The criticality level of the transformer (e.g., High, Medium, Low).'),
});
export type EstimateMaintenanceCostsInput = z.infer<typeof EstimateMaintenanceCostsInputSchema>;

const EstimateMaintenanceCostsOutputSchema = z.object({
    estimatedRepairCost: z.number().describe("The estimated cost in USD for a full reactive repair after failure."),
    preventativeMaintenanceCost: z.number().describe("The estimated cost in USD for preventative maintenance if caught early."),
    potentialSavings: z.number().describe("The calculated potential savings (Repair Cost - Preventative Cost)."),
    costBreakdown: z.string().describe("A brief, one-sentence explanation of the primary cost drivers for the repair."),
});
export type EstimateMaintenanceCostsOutput = z.infer<typeof EstimateMaintenanceCostsOutputSchema>;

export async function estimateMaintenanceCosts(input: EstimateMaintenanceCostsInput): Promise<EstimateMaintenanceCostsOutput> {
  return estimateMaintenanceCostsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateMaintenanceCostsPrompt',
  input: {schema: EstimateMaintenanceCostsInputSchema},
  output: {schema: EstimateMaintenanceCostsOutputSchema},
  prompt: `You are a financial analyst AI for an electrical power company. Your task is to provide cost estimations for transformer maintenance based on a given fault.

  Fault Classification: {{{faultClassification}}}
  Transformer Criticality: {{{criticality}}}

  Generate realistic cost estimates for the following, in USD:
  1.  **Estimated Repair Cost:** The cost if the fault leads to a full failure (reactive maintenance). This should be significantly higher. For 'High' criticality, this should be a very large number.
  2.  **Preventative Maintenance Cost:** The cost if the fault is addressed early through scheduled maintenance. This should be much lower than the repair cost.
  3.  **Potential Savings:** The difference between the two.
  4.  **Cost Breakdown:** A simple, one-sentence summary of what makes the reactive repair so expensive (e.g., "Includes costs for emergency crew deployment, replacement parts, and potential revenue loss from downtime.").

  Base your estimations on these general guidelines:
  - 'Winding Deformation' and 'Inter-turn Short' are the most expensive faults to repair.
  - 'Core Fault' is moderately expensive.
  - 'Bushing Fault' and 'Axial Displacement' are less expensive but still significant.
  - 'High' criticality should multiply all costs compared to 'Medium' or 'Low'.

  Provide the output in the specified JSON format.
`,
});

const estimateMaintenanceCostsFlow = ai.defineFlow(
  {
    name: 'estimateMaintenanceCostsFlow',
    inputSchema: EstimateMaintenanceCostsInputSchema,
    outputSchema: EstimateMaintenanceCostsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
