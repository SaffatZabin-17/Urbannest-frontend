import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Map,
  AdvancedMarker,
  Pin,
  useMap,
  type MapMouseEvent,
} from '@vis.gl/react-google-maps';
import { MapProvider } from './MapProvider';
import { useAddressAutocomplete, useReverseGeocode } from './hooks';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  GOOGLE_MAP_ID,
  SELECTED_ZOOM,
} from './constants';
import type { ListingCreateFormState } from '@/components/listing/create/types';
import type { SetLocationField } from '@/components/listing/create/types';
import type { LatLng } from './types';

type LocationPickerProps = {
  location: ListingCreateFormState['location'];
  setLocationField: SetLocationField;
};

export function LocationPicker(props: LocationPickerProps) {
  return (
    <MapProvider>
      <LocationPickerInner {...props} />
    </MapProvider>
  );
}

function LocationPickerInner({
  location,
  setLocationField,
}: LocationPickerProps) {
  const autocompleteContainerRef = useRef<HTMLDivElement>(null);
  const { reverseGeocode } = useReverseGeocode();

  const fillLocationFields = useCallback(
    (
      lat: number,
      lng: number,
      address: {
        addressLine: string;
        area: string;
        district: string;
        zipCode: string;
      } | null
    ) => {
      setLocationField('latitude', lat.toFixed(6));
      setLocationField('longitude', lng.toFixed(6));
      if (address) {
        setLocationField('addressLine', address.addressLine);
        setLocationField('area', address.area);
        setLocationField('district', address.district);
        setLocationField('zipCode', address.zipCode);
      }
    },
    [setLocationField]
  );

  useAddressAutocomplete(autocompleteContainerRef, (result) => {
    fillLocationFields(result.position.lat, result.position.lng, result);
  });

  const markerPosition: LatLng | null = useMemo(() => {
    const lat = parseFloat(location.latitude);
    const lng = parseFloat(location.longitude);
    if (Number.isFinite(lat) && Number.isFinite(lng)) {
      return { lat, lng };
    }
    return null;
  }, [location.latitude, location.longitude]);

  const handleMapClick = useCallback(
    async (event: MapMouseEvent) => {
      const latLng = event.detail.latLng;
      if (!latLng) return;

      const { lat, lng } = latLng;
      const address = await reverseGeocode({ lat, lng });
      fillLocationFields(lat, lng, address);
    },
    [reverseGeocode, fillLocationFields]
  );

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-custom-gray-700">
        Search for an address or click on the map to set the property location.
      </p>
      <div ref={autocompleteContainerRef} />
      <div className="h-[350px] w-full overflow-hidden rounded-xl border border-custom-gray-300">
        <Map
          mapId={GOOGLE_MAP_ID}
          defaultCenter={markerPosition ?? DEFAULT_CENTER}
          defaultZoom={markerPosition ? SELECTED_ZOOM : DEFAULT_ZOOM}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={handleMapClick}
          className="h-full w-full"
        >
          <MapViewportSync markerPosition={markerPosition} />
          {markerPosition && (
            <AdvancedMarker position={markerPosition}>
              <Pin
                background="#ff8b46"
                borderColor="#883301"
                glyphColor="#fff"
              />
            </AdvancedMarker>
          )}
        </Map>
      </div>
    </div>
  );
}

function MapViewportSync({
  markerPosition,
}: {
  markerPosition: LatLng | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !markerPosition) return;
    map.panTo(markerPosition);
    map.setZoom(SELECTED_ZOOM);
  }, [map, markerPosition]);

  return null;
}
