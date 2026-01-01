# **App Name**: NaviSafe

## Core Features:

- Map Display: Display a map interface using Leaflet, centered on a default city.
- Route Search: Allow users to search for routes between a start and end location using leaflet-geosearch.
- Route Rendering: Fetch route geometry from the OSRM API and render it as a polyline on the map.
- Black Spot Visualization: Fetch black spot data from Firestore and display them as markers on the map.
- Collision Detection: Implement a function to detect if the route passes within a threshold distance of any black spots.
- AI Safety Briefing: Use a Firebase Genkit flow powered by the Gemini tool to generate a safety briefing based on the black spots present on the route.
- Firestore Integration: Store and retrieve black spot data from Firestore.

## Style Guidelines:

- Primary color: A calming blue (#5DADE2) to instill trust and safety.
- Background color: A very light gray (#F5F5F5), almost white, to keep the focus on the map.
- Accent color: A vibrant orange (#E67E22) to highlight black spots and important safety warnings.
- Body and headline font: 'Inter', a sans-serif font providing a modern, machined and neutral look; ideal for both headlines and body text.
- Use clear and recognizable icons to represent different risk levels and road conditions.
- Clean and intuitive UI, prioritizing map visibility with overlaid controls for search and settings.
- Subtle animations for route rendering and black spot alerts to provide clear visual feedback.