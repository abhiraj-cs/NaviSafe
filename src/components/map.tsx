"use client";

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility';
import { MapContainer, TileLayer, Polyline, Marker, CircleMarker, Popup, useMap } from 'react-leaflet';
import type { LatLngBoundsExpression, LatLngExpression } from 'leaflet';
import type { BlackSpot } from '@/lib/data';
import { useEffect, memo } from 'react';

type MapProps = {
  center: LatLngExpression;
  zoom: number;
  blackSpots: BlackSpot[];
  route: LatLngExpression[] | null;
  start: LatLngExpression | null;
  end: LatLngExpression | null;
};

// Component to adjust map view when route changes
const ChangeView = ({ route, start, end }: { route: LatLngExpression[] | null, start: LatLngExpression | null, end: LatLngExpression | null }) => {
  const map = useMap();
  useEffect(() => {
    if (route && route.length > 0) {
      map.fitBounds(route as LatLngBoundsExpression, { padding: [50, 50] });
    } else if (start && end) {
      map.fitBounds([start, end], { padding: [50, 50] });
    }
  }, [route, start, end, map]);

  return null;
};

function MapComponent({ center, zoom, blackSpots, route, start, end }: MapProps) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom={true} className="h-full w-full z-0">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {blackSpots.map(spot => (
        <CircleMarker
          key={spot.id}
          center={[spot.lat, spot.lng]}
          radius={8}
          pathOptions={{
            color: spot.risk_level === 'High' ? 'hsl(0, 72%, 51%)' : 'hsl(var(--destructive))',
            fillColor: spot.risk_level === 'High' ? 'hsl(0, 72%, 51%)' : 'hsl(var(--destructive))',
            fillOpacity: 0.7,
          }}
        >
          <Popup>
            <b>Risk Level: {spot.risk_level}</b>
            <br />
            {spot.accident_history}
          </Popup>
        </CircleMarker>
      ))}

      {route && <Polyline pathOptions={{ color: 'hsl(var(--primary))', weight: 6 }} positions={route} />}

      {start && <Marker position={start}><Popup>Start</Popup></Marker>}
      {end && <Marker position={end}><Popup>End</Popup></Marker>}

      <ChangeView route={route} start={start} end={end} />
    </MapContainer>
  );
}

export default memo(MapComponent);