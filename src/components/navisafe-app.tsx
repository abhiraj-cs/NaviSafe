"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Map as MapIcon, Search, ShieldAlert, ShieldCheck } from 'lucide-react';
import { blackSpots, type BlackSpot } from '@/lib/data';
import { getSafetyBriefing } from '@/lib/actions';
import { haversineDistance } from '@/lib/utils';
import type { LatLngExpression } from 'leaflet';

const Map = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
});

const COLLISION_THRESHOLD = 50; // meters

type GeoCodedLocation = {
  lat: number;
  lon: number;
  display_name: string;
};

export default function NaviSafeApp() {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [route, setRoute] = useState<LatLngExpression[] | null>(null);
  const [startMarker, setStartMarker] = useState<LatLngExpression | null>(null);
  const [endMarker, setEndMarker] = useState<LatLngExpression | null>(null);
  const [safetyBriefing, setSafetyBriefing] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const geocode = async (address: string): Promise<GeoCodedLocation | null> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
      if (!response.ok) throw new Error('Geocoding failed');
      const data = await response.json();
      if (data.length > 0) {
        return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display_name: data[0].display_name };
      }
      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startPoint || !endPoint) {
      setError('Please enter both a start and end location.');
      return;
    }

    setIsLoading(true);
    setError('');
    setRoute(null);
    setSafetyBriefing(null);
    setStartMarker(null);
    setEndMarker(null);

    const startCoords = await geocode(startPoint);
    const endCoords = await geocode(endPoint);

    if (!startCoords || !endCoords) {
      setError('Could not find one or both locations. Please try again with more specific addresses.');
      setIsLoading(false);
      return;
    }

    setStartMarker([startCoords.lat, startCoords.lon]);
    setEndMarker([endCoords.lat, endCoords.lon]);

    try {
      const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${startCoords.lon},${startCoords.lat};${endCoords.lon},${endCoords.lat}?geometries=geojson`);
      if (!response.ok) throw new Error('Failed to fetch route');
      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        throw new Error('No route found between the specified locations.');
      }
      
      const routeGeometry = data.routes[0].geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]); // OSRM gives [lon, lat]
      setRoute(routeGeometry);

      // Collision detection
      const routePoints = routeGeometry.map((p: [number, number]) => ({ lat: p[0], lon: p[1] }));
      const collidingSpots = new Set<BlackSpot>();

      for (const spot of blackSpots) {
        for (const point of routePoints) {
          if (haversineDistance({ lat: spot.lat, lon: spot.lng }, point) <= COLLISION_THRESHOLD) {
            collidingSpots.add(spot);
            break; // Move to next spot once a collision is detected
          }
        }
      }

      const briefing = await getSafetyBriefing(Array.from(collidingSpots));
      setSafetyBriefing(briefing);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error(err);
      setError(`Failed to calculate the route. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const isWarning = safetyBriefing && (safetyBriefing.includes("Caution") || safetyBriefing.includes("passes near"));

  return (
    <div className="relative h-screen w-screen font-body">
      <Map
        center={[51.505, -0.09]} // Default to London
        zoom={12}
        blackSpots={blackSpots}
        route={route}
        start={startMarker}
        end={endMarker}
      />
      <div className="absolute top-4 left-4 right-4 md:left-4 md:right-auto md:w-full md:max-w-sm z-10">
        <Card className="shadow-2xl bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-headline flex items-center gap-2">
              <MapIcon className="h-6 w-6 text-primary" />
              NaviSafe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Start Location (e.g., 'Waterloo, London')"
                  value={startPoint}
                  onChange={(e) => setStartPoint(e.target.value)}
                  disabled={isLoading}
                />
                <Input
                  placeholder="End Location (e.g., 'Canary Wharf, London')"
                  value={endPoint}
                  onChange={(e) => setEndPoint(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {error && <p className="text-sm text-destructive px-1">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Find Safer Route
              </Button>
            </form>

            {isLoading && !safetyBriefing && (
              <div className="mt-4 flex items-center justify-center text-muted-foreground p-4 bg-background/50 rounded-md">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing route safety...
              </div>
            )}

            {safetyBriefing && (
              <div className="mt-4">
                  <Alert variant={isWarning ? "destructive" : "default"}>
                    {isWarning ? <ShieldAlert className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4 text-primary" />}
                    <AlertTitle className="font-headline">{isWarning ? "Safety Warning" : "Route Clear"}</AlertTitle>
                    <AlertDescription>
                      {safetyBriefing}
                    </AlertDescription>
                  </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
