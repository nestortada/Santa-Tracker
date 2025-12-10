import { Stop } from './types';

export const INITIAL_STOPS: Stop[] = [
  {
    id: '1',
    city: 'Rovaniemi',
    country: 'Finland',
    kidName: 'Santa\'s Workshop',
    gift: 'Preparation',
    coordinates: { lat: 66.5039, lng: 25.7294 },
    status: 'delivered',
    deliveryImage: 'https://images.unsplash.com/photo-1543589077-47d81606c1bf?q=80&w=1000&auto=format&fit=crop'
  },
 
];

export const GLOBE_IMAGE_URL = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
export const BACKGROUND_IMAGE_URL = '//unpkg.com/three-globe/example/img/night-sky.png';
