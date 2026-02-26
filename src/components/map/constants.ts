export const GOOGLE_MAPS_API_KEY = import.meta.env
  .VITE_GOOGLE_MAPS_API_KEY as string;

export const GOOGLE_MAP_ID = 'a6f42e61cd1af2519c803445';

export const DEFAULT_CENTER = { lat: 23.8103, lng: 90.4125 } as const;

export const DEFAULT_ZOOM = 13;

export const SELECTED_ZOOM = 16;

export const NEARBY_RADIUS_METERS = 2000;

export const PLACE_CATEGORIES = [
  {
    id: 'shopping_mall',
    label: 'Shopping Malls',
    type: 'shopping_mall',
    color: '#8B5CF6',
  },
  { id: 'school', label: 'Schools', type: 'school', color: '#0516AD' },
  { id: 'hospital', label: 'Hospitals', type: 'hospital', color: '#BF0404' },
  { id: 'park', label: 'Parks', type: 'park', color: '#22C55E' },
  {
    id: 'restaurant',
    label: 'Restaurants',
    type: 'restaurant',
    color: '#F59E0B',
  },
  {
    id: 'transit_station',
    label: 'Public Transport',
    type: 'transit_station',
    color: '#9008D4',
  },
  { id: 'mosque', label: 'Mosques', type: 'mosque', color: '#14B8A6' },
] as const;

export type PlaceCategoryId = (typeof PLACE_CATEGORIES)[number]['id'];
