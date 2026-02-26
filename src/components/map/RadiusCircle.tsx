import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { NEARBY_RADIUS_METERS } from './constants';
import type { LatLng } from './types';

type RadiusCircleProps = {
  center: LatLng;
  visible: boolean;
};

export function RadiusCircle({ center, visible }: RadiusCircleProps) {
  const map = useMap();
  const circleRef = useRef<google.maps.Circle | null>(null);

  useEffect(() => {
    if (!map) return;

    const circle = new google.maps.Circle({
      map,
      center,
      radius: NEARBY_RADIUS_METERS,
      strokeColor: '#ff8b46',
      strokeOpacity: 0.6,
      strokeWeight: 2,
      fillColor: '#ff8b46',
      fillOpacity: 0.08,
      clickable: false,
    });

    circleRef.current = circle;

    return () => {
      circle.setMap(null);
      circleRef.current = null;
    };
  }, [map, center]);

  useEffect(() => {
    circleRef.current?.setVisible(visible);
  }, [visible]);

  return null;
}
