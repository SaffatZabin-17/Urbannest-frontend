import { useCallback } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import type { GeocodedAddress, LatLng } from '../types';

function getComponent(
  components: google.maps.GeocoderAddressComponent[],
  type: string
) {
  return components.find((c) => c.types.includes(type))?.long_name ?? '';
}

export function useReverseGeocode() {
  const geocodingLib = useMapsLibrary('geocoding');

  const reverseGeocode = useCallback(
    async (position: LatLng): Promise<GeocodedAddress | null> => {
      if (!geocodingLib) return null;

      const geocoder = new geocodingLib.Geocoder();

      try {
        const response = await geocoder.geocode({ location: position });

        const result = response.results[0];
        if (!result) return null;

        const c = result.address_components;

        return {
          addressLine:
            result.formatted_address?.split(',')[0] ??
            `${getComponent(c, 'street_number')} ${getComponent(c, 'route')}`.trim(),
          area:
            getComponent(c, 'sublocality_level_1') ||
            getComponent(c, 'sublocality') ||
            getComponent(c, 'neighborhood') ||
            getComponent(c, 'locality'),
          district:
            getComponent(c, 'administrative_area_level_2') ||
            getComponent(c, 'administrative_area_level_1') ||
            getComponent(c, 'locality'),
          zipCode: getComponent(c, 'postal_code'),
        };
      } catch {
        return null;
      }
    },
    [geocodingLib]
  );

  return { reverseGeocode, ready: !!geocodingLib };
}
