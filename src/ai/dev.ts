'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-expert-system-rules.ts';
import '@/ai/flows/generate-actionable-insights.ts';
import '@/ai/flows/augment-dashboard-with-ai-explanations.ts';
import '@/ai/flows/classify-fra-data.ts';
import '@/ai/flows/recognize-role-command.ts';
import '@/ai/flows/get-contributing-factors.ts';
import '@/ai/flows/get-health-compass-reading.ts';
import '@/ai/flows/chatWithVajra.ts';
