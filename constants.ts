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
  {
    id: '2',
    city: 'Tokyo',
    country: 'Japan',
    kidName: 'Kenji',
    gift: 'Robot Kit',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    status: 'pending'
  },
  {
    id: '3',
    city: 'Sydney',
    country: 'Australia',
    kidName: 'Matilda',
    gift: 'Surfboard',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    status: 'pending'
  },
  {
    id: '4',
    city: 'Paris',
    country: 'France',
    kidName: 'Sophie',
    gift: 'Easel & Paints',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    status: 'pending'
  },
  {
    id: '5',
    city: 'New York',
    country: 'USA',
    kidName: 'Ethan',
    gift: 'Telescope',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    status: 'pending'
  }
];

export const GLOBE_IMAGE_URL = '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
export const BACKGROUND_IMAGE_URL = '//unpkg.com/three-globe/example/img/night-sky.png';
