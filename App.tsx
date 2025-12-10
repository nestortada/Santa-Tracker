import React, { useState, useEffect, useCallback, useRef } from 'react';
import GlobeVis from './components/GlobeVis';
import MissionControl from './components/MissionControl';
import DeliveryModal from './components/DeliveryModal';
import { INITIAL_STOPS } from './constants';
import { Stop, Coordinates, SantaState } from './types';
import { generateDeliveryImage } from './services/geminiService';
import { v4 as uuidv4 } from 'uuid';

// Helper to calculate intermediate point for smoother animation
function interpolate(start: Coordinates, end: Coordinates, fraction: number): Coordinates {
  return {
    lat: start.lat + (end.lat - start.lat) * fraction,
    lng: start.lng + (end.lng - start.lng) * fraction
  };
}

// Distance helper (very rough approximation for trigger radius)
function getDistance(c1: Coordinates, c2: Coordinates) {
    return Math.sqrt(Math.pow(c1.lat - c2.lat, 2) + Math.pow(c1.lng - c2.lng, 2));
}

const App: React.FC = () => {
  const [stops, setStops] = useState<Stop[]>(INITIAL_STOPS);
  const [santaState, setSantaState] = useState<SantaState>({
    position: INITIAL_STOPS[0].coordinates,
    heading: 0,
    currentStopId: INITIAL_STOPS[0].id,
    nextStopId: INITIAL_STOPS[1]?.id || null,
    phase: 'idle'
  });
  
  const [deliveryModalData, setDeliveryModalData] = useState<{stop: Stop, url: string} | null>(null);
  
  // Animation refs
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const speedRef = useRef<number>(0.005); // Speed of travel (fraction per frame)
  const progressRef = useRef<number>(0);

  // Add new stop handler
  const handleAddStop = useCallback((stopData: Pick<Stop, 'city' | 'country' | 'kidName' | 'gift' | 'coordinates'>) => {
    const newStop: Stop = {
        id: uuidv4(),
        ...stopData,
        status: 'pending'
    };
    setStops(prev => {
        const next = [...prev, newStop];
        // If Santa was idle at the end of the list, trigger movement to this new stop
        return next;
    });
  }, []);

  // Main Simulation Loop
  const animate = useCallback((time: number) => {
    if (lastTimeRef.current != undefined) {
      // const deltaTime = time - lastTimeRef.current;
      
      setSantaState(current => {
        // If we don't have a next stop, stay put
        if (!current.nextStopId) {
            // Check if there are new pending stops
            const nextPendingIndex = stops.findIndex(s => s.status === 'pending');
            if (nextPendingIndex !== -1) {
                return {
                    ...current,
                    nextStopId: stops[nextPendingIndex].id,
                    phase: 'flying'
                };
            }
            return current;
        }

        const startStop = stops.find(s => s.id === current.currentStopId);
        const endStop = stops.find(s => s.id === current.nextStopId);

        if (!startStop || !endStop) return current;

        // If delivering, just wait (logic handled in useEffect)
        if (current.phase === 'delivering') return current;

        // Update progress
        progressRef.current += speedRef.current;

        if (progressRef.current >= 1) {
            // Arrived!
            progressRef.current = 0;
            return {
                ...current,
                position: endStop.coordinates,
                currentStopId: endStop.id,
                phase: 'delivering' // This triggers the side effect
            };
        }

        // Interpolate position
        const newPos = interpolate(startStop.coordinates, endStop.coordinates, progressRef.current);
        
        // Update "En-route" status of next stop if not already
        if (endStop.status === 'pending') {
            setStops(prev => prev.map(s => s.id === endStop.id ? {...s, status: 'en-route'} : s));
        }

        return {
            ...current,
            position: newPos,
            phase: 'flying'
        };
      });
    }
    lastTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, [stops]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, [animate]);


  // Handle Arrival & Delivery Logic
  useEffect(() => {
    if (santaState.phase === 'delivering' && santaState.currentStopId) {
        const currentStop = stops.find(s => s.id === santaState.currentStopId);
        if (!currentStop || currentStop.status === 'delivered') return;

        // 1. Mark as Delivered in UI
        // 2. Pause simulation (effectively paused by phase check in animate loop)
        // 3. Generate Image
        // 4. Show Modal
        // 5. Resume after delay

        const handleDelivery = async () => {
             // Generate Image
             console.log(`Generating delivery image for ${currentStop.city}...`);
             const imageUrl = await generateDeliveryImage(currentStop.kidName, currentStop.gift, currentStop.city, currentStop.country);
             
             // Show Modal
             if (imageUrl) {
                 setDeliveryModalData({ stop: currentStop, url: imageUrl });
             }

             // Update Stop Status
             setStops(prev => prev.map(s => s.id === currentStop.id ? {...s, status: 'delivered', deliveryImage: imageUrl || undefined} : s));

             // Wait for user to close modal OR auto close after 8 seconds
             setTimeout(() => {
                setDeliveryModalData(null);
                setSantaState(prev => {
                    // Find next pending stop
                    const currentIdx = stops.findIndex(s => s.id === prev.currentStopId);
                    const nextStop = stops[currentIdx + 1];
                    
                    return {
                        ...prev,
                        nextStopId: nextStop ? nextStop.id : null,
                        phase: nextStop ? 'flying' : 'idle'
                    };
                });
             }, 8000);
        };

        handleDelivery();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [santaState.phase, santaState.currentStopId]); // Depend primarily on phase change


  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
        {/* Globe Visualization */}
        <div className="absolute inset-0 z-0">
            <GlobeVis 
                stops={stops} 
                santaPosition={santaState.position} 
            />
        </div>

        {/* UI Overlay */}
        <MissionControl 
            stops={stops} 
            onAddStop={handleAddStop}
            currentStopId={santaState.currentStopId}
        />

        {/* Modal */}
        {deliveryModalData && (
            <DeliveryModal 
                stop={deliveryModalData.stop}
                imageUrl={deliveryModalData.url}
                onClose={() => setDeliveryModalData(null)}
            />
        )}

        {/* Connection Status / Debug (Optional) */}
        <div className="absolute bottom-4 right-4 text-slate-500 text-xs font-mono pointer-events-none">
            LAT: {santaState.position.lat.toFixed(2)} | LNG: {santaState.position.lng.toFixed(2)} | PHASE: {santaState.phase.toUpperCase()}
        </div>
    </div>
  );
};

export default App;