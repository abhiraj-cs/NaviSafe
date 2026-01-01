'use server';

/**
 * @fileOverview A route safety briefing AI agent.
 *
 * - generateRouteSafetyBriefing - A function that handles the generation of a route safety briefing.
 * - GenerateRouteSafetyBriefingInput - The input type for the generateRouteSafetyBriefing function.
 * - GenerateRouteSafetyBriefingOutput - The return type for the generateRouteSafetyBriefing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRouteSafetyBriefingInputSchema = z.object({
  blackSpots: z
    .array(
      z.object({
        lat: z.number().describe('Latitude of the black spot.'),
        lng: z.number().describe('Longitude of the black spot.'),
        risk_level: z
          .enum(['High', 'Medium'])
          .describe('Risk level of the black spot.'),
        accident_history: z.string().describe('Accident history of the black spot.'),
      })
    )
    .describe('A list of black spots along the route.'),
});
export type GenerateRouteSafetyBriefingInput = z.infer<
  typeof GenerateRouteSafetyBriefingInputSchema
>;

const GenerateRouteSafetyBriefingOutputSchema = z.object({
  safetyBriefing: z
    .string()
    .describe('A safety briefing for the route, highlighting potential risks.'),
});
export type GenerateRouteSafetyBriefingOutput = z.infer<
  typeof GenerateRouteSafetyBriefingOutputSchema
>;

export async function generateRouteSafetyBriefing(
  input: GenerateRouteSafetyBriefingInput
): Promise<GenerateRouteSafetyBriefingOutput> {
  return generateRouteSafetyBriefingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRouteSafetyBriefingPrompt',
  input: {schema: GenerateRouteSafetyBriefingInputSchema},
  output: {schema: GenerateRouteSafetyBriefingOutputSchema},
  prompt: `You are a safety advisor for a navigation application. Generate a safety briefing for a route based on the following black spots:

{{#if blackSpots}}
  {{#each blackSpots}}
Caution: This route passes near a black spot at latitude {{lat}} and longitude {{lng}}. Risk level: {{risk_level}}. Accident history: {{accident_history}}. Reduce speed and drive cautiously.
  {{/each}}
{{else}}
  This route appears to be clear of known black spots. Drive safely.
{{/if}}
`,
});

const generateRouteSafetyBriefingFlow = ai.defineFlow(
  {
    name: 'generateRouteSafetyBriefingFlow',
    inputSchema: GenerateRouteSafetyBriefingInputSchema,
    outputSchema: GenerateRouteSafetyBriefingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
