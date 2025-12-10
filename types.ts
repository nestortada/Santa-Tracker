export interface Coordinates {
  lat: number;
  lng: number;
}

export type DeliveryStatus = 'pending' | 'en-route' | 'delivering' | 'delivered';

export interface Stop {
  id: string;
  city: string;
  country: string;
  kidName: string;
  gift: string;
  coordinates: Coordinates;
  status: DeliveryStatus;
  deliveryImage?: string; // URL of generated image
}

export interface SantaState {
  position: Coordinates;
  heading: number; // Bearing in degrees
  currentStopId: string | null;
  nextStopId: string | null;
  phase: 'idle' | 'flying' | 'delivering';
}
