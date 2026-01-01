export type BlackSpot = {
  id: string;
  lat: number;
  lng: number;
  risk_level: 'High' | 'Medium';
  accident_history: string;
};

// Dummy data for London, UK
export const blackSpots: BlackSpot[] = [
  {
    id: 'bs-1',
    lat: 51.509865,
    lng: -0.118092,
    risk_level: 'High',
    accident_history: 'Frequent rear-end collisions during peak hours at Waterloo Bridge.',
  },
  {
    id: 'bs-2',
    lat: 51.51279,
    lng: -0.09099,
    risk_level: 'Medium',
    accident_history: 'Several incidents involving cyclists and turning vehicles near St. Paul\'s Cathedral.',
  },
  {
    id: 'bs-3',
    lat: 51.507351,
    lng: -0.08233,
    risk_level: 'High',
    accident_history: 'High number of pedestrian-related accidents at the Tower Bridge crossing.',
  },
  {
    id: 'bs-4',
    lat: 51.5194,
    lng: -0.1269,
    risk_level: 'Medium',
    accident_history: 'Known for sideswipe accidents due to narrow lanes around Covent Garden.',
  },
  {
    id: 'bs-5',
    lat: 51.4993,
    lng: -0.1428,
    risk_level: 'High',
    accident_history: 'Major roundabout at Hyde Park Corner with complex merging, leading to frequent incidents.',
  },
  {
    id: 'bs-6',
    lat: 51.501,
    lng: -0.142,
    risk_level: 'Medium',
    accident_history: 'Junction near Buckingham Palace with high tourist footfall and vehicle congestion.',
  },
  {
    id: 'bs-7',
    lat: 51.515,
    lng: -0.142,
    risk_level: 'High',
    accident_history: 'Oxford Circus intersection is one of the busiest in London, with many pedestrian incidents.',
  },
];
