'use server';

import { generateRouteSafetyBriefing } from '@/ai/flows/generate-route-safety-briefing';
import type { BlackSpot } from './data';

export async function getSafetyBriefing(blackSpots: BlackSpot[]): Promise<string> {
  try {
    const briefingInput = {
      blackSpots: blackSpots.map(bs => ({
        lat: bs.lat,
        lng: bs.lng,
        risk_level: bs.risk_level,
        accident_history: bs.accident_history,
      })),
    };
    const result = await generateRouteSafetyBriefing(briefingInput);
    return result.safetyBriefing;
  } catch (error) {
    console.error('Error generating safety briefing:', error);
    return 'Could not generate a safety briefing at this time. Please proceed with caution.';
  }
}
