import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.AIzaSyCThb8aDkAmmrGphSwA7PzaL2QqQlvJXPQ})],
  model: 'googleai/gemini-2.5-flash',
});
