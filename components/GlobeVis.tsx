import React, { useMemo, useEffect, useRef } from 'react';
import Globe, { GlobeMethods } from 'react-globe.gl';
import { Stop, Coordinates } from '../types';
import { GLOBE_IMAGE_URL, BACKGROUND_IMAGE_URL } from '../constants';

interface GlobeVisProps {
  stops: Stop[];
  santaPosition: Coordinates;
  onStopClick?: (stop: Stop) => void;
}

const GlobeVis: React.FC<GlobeVisProps> = ({ stops, santaPosition, onStopClick }) => {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);

  // Auto-rotate logic or camera follow logic could go here
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.controls().autoRotate = false;
      globeEl.current.controls().enableZoom = true;
      // Smoothly look at Santa
      globeEl.current.pointOfView({ lat: santaPosition.lat, lng: santaPosition.lng, altitude: 2.5 }, 1000);
    }
  }, [santaPosition]);

  const arcsData = useMemo(() => {
    const arcs = [];
    for (let i = 0; i < stops.length - 1; i++) {
        // Only show path if the destination is delivered or next
        if (stops[i].status === 'delivered') {
            arcs.push({
                startLat: stops[i].coordinates.lat,
                startLng: stops[i].coordinates.lng,
                endLat: stops[i+1].coordinates.lat,
                endLng: stops[i+1].coordinates.lng,
                color: stops[i+1].status === 'delivered' ? '#10b981' : '#f59e0b', // Green if done, Orange if next
                dashLength: 0.5,
                dashGap: 4,
                dashAnimateTime: 2000
            });
        }
    }
    return arcs;
  }, [stops]);

  // We combine cities and Santa into custom HTML elements or Points
  // Using customHtmlElements for Santa allows us to use an image/icon
  const customData = useMemo(() => {
    const data = stops.map(stop => ({
        lat: stop.coordinates.lat,
        lng: stop.coordinates.lng,
        type: 'stop',
        data: stop
    }));
    
    // Add Santa
    data.push({
        lat: santaPosition.lat,
        lng: santaPosition.lng,
        type: 'santa',
        data: { id: 'santa', city: 'Sleigh', status: 'moving' } as any
    });

    return data;
  }, [stops, santaPosition]);

  return (
    <div className="cursor-move">
      <Globe
        ref={globeEl}
        globeImageUrl={GLOBE_IMAGE_URL}
        backgroundImageUrl={BACKGROUND_IMAGE_URL}
        atmosphereColor="#3a228a"
        atmosphereAltitude={0.15}
        
        // Arcs (Flight paths)
        arcsData={arcsData}
        arcColor="color"
        arcDashLength="dashLength"
        arcDashGap="dashGap"
        arcDashAnimateTime="dashAnimateTime"
        arcStroke={1.5}
        // arcAltitude={0.2}

        // Custom Markers (HTML)
        htmlElementsData={customData}
        htmlElement={(d: any) => {
            const el = document.createElement('div');
            
            if (d.type === 'santa') {
                el.innerHTML = `
                    <div style="transform: translate(-50%, -100%); width: 60px; height: 60px; pointer-events: none;">
                        <img src="https://cdn-icons-png.flaticon.com/512/375/375216.png" style="width: 100%; height: 100%; filter: drop-shadow(0 0 10px gold);" alt="Santa" />
                    </div>
                `;
            } else {
                const stop = d.data as Stop;
                const color = stop.status === 'delivered' ? '#10b981' : (stop.status === 'en-route' ? '#f59e0b' : '#ef4444');
                const size = stop.status === 'en-route' ? '16px' : '10px';
                
                el.innerHTML = `
                    <div style="display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%); cursor: pointer;">
                         <div style="width: ${size}; height: ${size}; background-color: ${color}; border-radius: 50%; box-shadow: 0 0 8px ${color}; border: 2px solid white;"></div>
                         <div style="position: absolute; top: 100%; left: 50%; transform: translateX(-50%); color: white; font-family: sans-serif; font-size: 10px; font-weight: bold; text-shadow: 0 0 4px black; white-space: nowrap; margin-top: 4px;">${stop.city}</div>
                    </div>
                `;
                el.onclick = () => onStopClick && onStopClick(stop);
            }
            return el;
        }}
      />
    </div>
  );
};

export default GlobeVis;
