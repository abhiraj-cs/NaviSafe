export type BlackSpot = {
  id: string;
  lat: number;
  lng: number;
  risk_level: 'High' | 'Medium';
  accident_history: string;
};

// Dummy data for Alappuzha and Pathanamthitta districts, Kerala, India
export const blackSpots: BlackSpot[] = [
  {
    id: 'bs-1',
    lat: 9.503,
    lng: 76.33,
    risk_level: 'High',
    accident_history: 'Frequent collisions on the NH66 bypass near Alappuzha beach junction.',
  },
  {
    id: 'bs-2',
    lat: 9.266,
    lng: 76.78,
    risk_level: 'Medium',
    accident_history: 'Several incidents involving two-wheelers on the main central road in Pathanamthitta town.',
  },
  {
    id: 'bs-3',
    lat: 9.15,
    lng: 76.52,
    risk_level: 'High',
    accident_history: 'High number of accidents on the Kayamkulam-Punalur road due to sharp turns.',
  },
  {
    id: 'bs-4',
    lat: 9.35,
    lng: 76.52,
    risk_level: 'Medium',
    accident_history: 'Known for sideswipe accidents due to narrow lanes around Chengannur.',
  },
  {
    id: 'bs-5',
    lat: 9.2,
    lng: 76.6,
    risk_level: 'High',
    accident_history: 'Complex junction near Pandalam with frequent traffic violations.',
  },
];
