export type BlackSpot = {
  id: string;
  lat: number;
  lng: number;
  risk_level: 'High' | 'Medium';
  accident_history: string;
  report_count: number;
};
