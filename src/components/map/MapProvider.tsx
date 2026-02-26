import type { ReactNode } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from './constants';

type MapProviderProps = {
  children: ReactNode;
};

export function MapProvider({ children }: MapProviderProps) {
  return <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>{children}</APIProvider>;
}
