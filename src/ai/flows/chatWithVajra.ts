'use server';
/**
 * @fileOverview A conversational AI flow for the Vajra Assistant chatbot.
 *
 * - chatWithVajra - A function that handles the chatbot conversation.
 * - ChatWithVajraInput - The input type for the function.
 * - ChatWithVajraOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {Message, z} from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'model']),
  content: z.string(),
});

const ChatWithVajraInputSchema = z.object({
  history: z.array(MessageSchema),
  message: z.string(),
});
export type ChatWithVajraInput = z.infer<typeof ChatWithVajraInputSchema>;

const ChatWithVajraOutputSchema = z.object({
  response: z.string(),
});
export type ChatWithVajraOutput = z.infer<typeof ChatWithVajraOutputSchema>;

const knowledgeBase: Record<string, string> = {
    // Basic Greetings & Info
    "hello": "Hello! I'm Vajra Assistant, an expert AI specializing in transformer diagnostics. How can I help you today?",
    "hi": "Hello! I'm Vajra Assistant. How can I assist you with your transformer-related questions?",
    "what is your name": "My name is Vajra Assistant. I am an AI specialized in transformer diagnostics.",
    "what can you do": "I can provide information about transformer fault types, asset status, criticality levels, and general concepts like Frequency Response Analysis (FRA).",
    "who are you": "I am Vajra Assistant, an AI designed to help users understand fault analysis data and manage their transformer fleet.",

    // Transformer Fault Types
    "what is a transformer fault": "A transformer fault is any defect, imperfection, or issue that affects the transformer's normal operation. Common faults include winding deformation, core faults, and bushing faults.",
    "what is winding deformation": "Winding Deformation is a physical change in the shape or position of the windings, often caused by mechanical stress from short-circuit events. On an FRA trace, it appears as significant deviations in the mid-to-high frequency ranges (typically >10 kHz).",
    "what causes winding deformation": "The most common cause of winding deformation is the immense mechanical force generated during an external short circuit. Transportation mishaps and seismic events can also cause it.",
    "how to detect winding deformation": "Winding deformation is best detected using Frequency Response Analysis (FRA), where it shows up as significant deviations in the mid-to-high frequency ranges.",
    "what is axial displacement": "Axial Displacement is a type of winding deformation where the winding moves along its vertical axis (up or down). It affects the mutual inductance and is seen as deviations in the low-to-mid frequency range of the FRA response.",
    "what is radial displacement": "Radial Displacement is a type of winding deformation where the winding moves inward or outward from its central axis. It primarily affects the leakage inductance of the transformer.",
    "difference between axial and radial displacement": "Axial displacement is movement along the vertical axis, affecting mutual inductance (low-mid frequencies). Radial displacement is movement along the horizontal (radial) axis, affecting leakage inductance (mid-high frequencies).",
    "what is a core fault": "A Core Fault refers to issues with the magnetic core of the transformer, such as shorted laminations or problems with core grounding. This is typically visible as a deviation at very low frequencies (e.g., <2 kHz) in an FRA test.",
    "how to detect a core fault": "Core faults are identified by deviations in the very low-frequency range of the FRA trace. Other methods like dissolved gas analysis (DGA) can also indicate core issues.",
    "what is a bushing fault": "A Bushing Fault is a failure in the insulating bushing, which is used to pass a conductor through a grounded barrier. It affects the high-frequency response of the FRA measurement due to changes in capacitance.",
    "what causes a bushing fault": "Bushing faults can be caused by moisture ingress, contamination, aging of insulation material, or physical damage. It's a critical fault as it can lead to catastrophic failure.",
    "what is an inter-turn short": "An Inter-turn Short is a short circuit between adjacent turns of a winding. It manifests as a sharp dip or 'null' in the FRA response at a specific resonant frequency, creating a new resonant circuit.",
    "how to identify an inter-turn short": "The key identifier for an inter-turn short in an FRA trace is the creation of a new, sharp resonance point (a deep null) that was not present in the baseline measurement.",
    
    // Asset Status & Criticality
    "what does operational status mean": "Operational Status indicates the current working condition of a transformer. It can be 'Operational', 'Needs Attention', or 'Under Maintenance'.",
    "what is an operational asset": "An 'Operational' asset is functioning correctly within its normal parameters, with no active alerts or known faults.",
    "what does needs attention mean": "An asset with a 'Needs Attention' status has an active alert or a diagnosed fault that requires inspection or further action. It is still in service but is at risk.",
    "what is under maintenance status": "An asset that is 'Under Maintenance' is currently offline and being serviced by an engineering team. It is not delivering power.",
    "what is criticality level": "Criticality Level classifies how important an asset is to the overall grid. Failure of a high-criticality asset would cause much more disruption than a low-criticality one.",
    "what is high criticality": "A 'High' criticality level is assigned to a critical asset whose failure would cause significant disruption to the power grid, such as widespread outages or impacting essential services.",
    "what is medium criticality": "A 'Medium' criticality level is for an important asset whose failure would cause moderate, localized disruption.",
    "what is low criticality": "A 'Low' criticality level is for a non-critical asset whose failure would have a minor impact, often because of redundancy in the network.",

    // FRA (Frequency Response Analysis)
    "what is fra": "Frequency Response Analysis (FRA) is a diagnostic method to evaluate the mechanical and electrical integrity of a transformer by measuring its frequency response. It is often described as an 'x-ray' for the transformer.",
    "what does fra measure": "FRA measures how a transformer responds to a wide range of electrical frequencies. It can detect physical changes inside the transformer, like winding movement or core issues, by comparing a current measurement to a baseline 'fingerprint' taken when the transformer was known to be healthy.",
    "why is fra important": "FRA is important because it can detect internal mechanical problems that other electrical tests cannot. This allows for early detection of faults before they lead to a catastrophic failure.",
    "what is an fra trace": "An FRA trace is the graphical plot of the transformer's response (gain and phase) against frequency. Comparing this trace to a baseline helps diagnose internal problems.",
    "what is a baseline fra measurement": "A baseline or 'fingerprint' FRA measurement is a reference trace taken when the transformer is new or known to be in good condition. All future FRA tests are compared against this baseline to identify deviations.",

    // General Concepts
    "what is a transformer": "A transformer is an electrical device that transfers energy between circuits through electromagnetic induction. It is most commonly used to increase ('step-up') or decrease ('step-down') voltage levels between circuits.",
    "how does a transformer work": "A transformer works on the principle of mutual induction. An alternating current in the primary winding creates a changing magnetic field in the core, which then induces a voltage in the secondary winding.",
    "what is transformer oil": "Transformer oil provides insulation and acts as a coolant to dissipate heat. Analyzing the gases dissolved in the oil (Dissolved Gas Analysis or DGA) is another common method for diagnosing transformer health.",
    "what is dga": "DGA stands for Dissolved Gas Analysis. It is a diagnostic test where the oil of a transformer is sampled and analyzed to determine the concentration of various gases, which can indicate thermal or electrical faults.",
    "fra vs dga": "FRA is excellent for detecting mechanical issues (like winding deformation), while DGA is excellent for detecting thermal and electrical faults (like overheating or arcing). They are complementary diagnostic tools.",
    
    // UI & App related
    "what is the dashboard for": "The dashboard provides a high-level overview of your transformer fleet's health, including active alerts, system health percentage, and various performance charts.",
    "what is the map view": "The Map View gives a geographical representation of your assets, allowing you to see their live status and any AI-predicted risk zones.",
    "what is the analysis page": "The Analysis page is where you can upload Frequency Response Analysis (FRA) data for a specific transformer. Our AI will then analyze it and provide a fault diagnosis.",
    "what is a health compass": "The Health Compass on the analysis results page gives a quick visual indication of the type of fault risk detected, such as Mechanical, Core, Winding, or Thermal.",
    "what is root cause analysis": "The Root Cause Analysis chart identifies the most likely contributing factors to a detected fault and shows their percentage of influence on the diagnosis.",
    
    // More Technical Faults
    "what does a deviation in low frequency fra mean": "Deviations in the low-frequency range (e.g., below 2 kHz) typically point to problems with the magnetic core, such as shorted laminations or open circuits in the core.",
    "what does a deviation in mid frequency fra mean": "Deviations in the mid-frequency range often indicate axial or radial displacement of the windings, affecting the mutual inductance between them.",
    "what does a deviation in high frequency fra mean": "Deviations in the high-frequency range are usually related to changes in the transformer's capacitance, often caused by issues with bushings, leads, or inter-turn shorts.",
    "what is leakage inductance": "Leakage inductance is an inductive component in a transformer model that results from the imperfect magnetic linking of one winding to another. It's particularly sensitive to radial winding deformation.",
    "what is mutual inductance": "Mutual inductance is the effect where a change in current in one winding induces a voltage in another. It's sensitive to the relative positioning of the windings, so it is affected by axial displacement.",

    // Safety and Maintenance
    "what is proactive maintenance": "Proactive (or preventative) maintenance is the practice of performing scheduled service or repairs based on data and prediction to prevent failures, rather than waiting for something to break.",
    "what is reactive maintenance": "Reactive maintenance is fixing assets only after they have failed. It is often more expensive and leads to more downtime than proactive maintenance.",
    "is a 'needs attention' asset safe": "An asset marked as 'Needs Attention' is still operational but has a detected anomaly. It is considered at-risk and should be inspected as soon as possible to prevent a potential failure."
};


export async function chatWithVajra(
  input: ChatWithVajraInput
): Promise<ChatWithVajraOutput> {
  return chatWithVajraFlow(input);
}

const chatWithVajraFlow = ai.defineFlow(
  {
    name: 'chatWithVajraFlow',
    inputSchema: ChatWithVajraInputSchema,
    outputSchema: ChatWithVajraOutputSchema,
  },
  async ({history, message}) => {
    
    const userMessage = message.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
    let bestMatch: { key: string, score: number } | null = null;

    for (const key in knowledgeBase) {
      const question = key.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
      let score = 0;
      
      if (question === userMessage) {
        score = 100;
      } else if (userMessage.includes(question) || question.includes(userMessage)) {
        const queryWords = new Set(userMessage.split(' '));
        const keyWords = new Set(question.split(' '));
        const intersection = new Set([...queryWords].filter(x => keyWords.has(x)));
        const union = new Set([...queryWords, ...keyWords]);
        score = (intersection.size / union.size) * 100;
      }
      
      if (score > (bestMatch?.score || 0)) {
        bestMatch = { key, score };
      }
    }

    let response = "I'm sorry, I don't have information on that topic. I can answer questions about transformer faults, asset status, and Frequency Response Analysis (FRA).";

    if (bestMatch && bestMatch.score > 50) { // Threshold for a decent match
      response = knowledgeBase[bestMatch.key];
    }
    
    return { response };
  }
);

    