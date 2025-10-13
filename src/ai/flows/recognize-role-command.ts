'use server';
/**
 * @fileOverview Recognizes a user's role from a voice command.
 *
 * - recognizeRoleCommand - A function that processes audio and returns the identified role.
 * - RecognizeRoleCommandInput - The input type for the recognizeRoleCommand function.
 * - RecognizeRoleCommandOutput - The return type for the recognizeRoleCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecognizeRoleCommandInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A chunk of audio as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type RecognizeRoleCommandInput = z.infer<typeof RecognizeRoleCommandInputSchema>;

const RecognizeRoleCommandOutputSchema = z.object({
    role: z.enum(['field_engineer', 'manager', 'unknown']).describe("The role identified from the voice command. It can be 'field_engineer', 'manager', or 'unknown'.")
});
export type RecognizeRoleCommandOutput = z.infer<typeof RecognizeRoleCommandOutputSchema>;

export async function recognizeRoleCommand(
  input: RecognizeRoleCommandInput
): Promise<RecognizeRoleCommandOutput> {
  return recognizeRoleCommandFlow(input);
}

const prompt = ai.definePrompt({
    name: 'recognizeRoleCommandPrompt',
    input: { schema: z.object({ text: z.string() }) },
    output: { schema: RecognizeRoleCommandOutputSchema },
    prompt: `You are a voice command parser for a login system. Your task is to identify the user's desired role from their speech. The only valid roles are "field_engineer" and "manager".

    - If the user mentions "engineer", "field engineer", or a similar variation, the role is "field_engineer".
    - If the user mentions "manager", "lead", or a similar variation, the role is "manager".
    - If the role is unclear or not mentioned, the role is "unknown".

    User's transcribed text: "{{{text}}}"

    Determine the role.`,
});


const recognizeRoleCommandFlow = ai.defineFlow(
  {
    name: 'recognizeRoleCommandFlow',
    inputSchema: RecognizeRoleCommandInputSchema,
    outputSchema: RecognizeRoleCommandOutputSchema,
  },
  async (input) => {
    // 1. Transcribe the audio to text
    const {text} = await ai.generate({
        model: 'googleai/gemini-2.5-flash',
        prompt: [{media: {url: input.audioDataUri}}, {text: "Transcribe the following audio."}]
    });

    if(!text) {
        return { role: 'unknown' };
    }
    
    // 2. Classify the role from the transcribed text
    const {output} = await prompt({ text });
    return output!;
  }
);
