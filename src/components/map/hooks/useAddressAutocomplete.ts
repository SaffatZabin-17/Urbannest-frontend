import { useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import type { GeocodedAddress, LatLng } from '../types';

type AutocompleteResult = GeocodedAddress & {
  position: LatLng;
};

type PlaceSelectLikeEvent = Event & {
  place?: google.maps.places.Place;
  placePrediction?: google.maps.places.PlacePrediction;
  detail?: {
    place?: google.maps.places.Place;
    placePrediction?: google.maps.places.PlacePrediction;
  };
};

function getPlaceFromSelectEvent(event: PlaceSelectLikeEvent) {
  if (event.place) return event.place;
  if (event.placePrediction) return event.placePrediction.toPlace();
  if (event.detail?.place) return event.detail.place;
  if (event.detail?.placePrediction)
    return event.detail.placePrediction.toPlace();
  return null;
}

/**
 * Appends a `PlaceAutocompleteElement` web component into `containerRef`
 * and calls `onSelect` when the user picks a suggestion.
 */
export function useAddressAutocomplete(
  containerRef: React.RefObject<HTMLDivElement | null>,
  onSelect: (result: AutocompleteResult) => void
) {
  // Load the places library so the web component is registered
  const placesLibrary = useMapsLibrary('places');

  const onSelectRef = useRef(onSelect);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    const mapsGoogle = typeof google === 'undefined' ? undefined : google;
    const PlaceAutocompleteElement =
      mapsGoogle?.maps?.places?.PlaceAutocompleteElement;

    if (!container || !placesLibrary || !PlaceAutocompleteElement) return;

    const el = new PlaceAutocompleteElement({});
    el.classList.add('urban-nest-place-autocomplete');
    el.style.width = '100%';
    el.style.setProperty('color-scheme', 'light');
    el.style.setProperty('background-color', '#ffffff');
    el.style.setProperty('border', '1px solid #dbdbdb');
    el.style.setProperty('border-radius', '0.75rem');
    container.appendChild(el);

    const handler = async (event: Event) => {
      const place = getPlaceFromSelectEvent(event as PlaceSelectLikeEvent);
      if (!place) return;

      try {
        await place.fetchFields({
          fields: ['location', 'addressComponents', 'formattedAddress'],
        });
      } catch {
        // Keep the UI functional even if optional fields fail to load.
        return;
      }

      const loc = place.location;
      if (!loc) return;

      const components = place.addressComponents ?? [];

      const get = (type: string) =>
        components.find((c) => c.types.includes(type))?.longText ??
        components.find((c) => c.types.includes(type))?.shortText ??
        '';

      onSelectRef.current({
        position: { lat: loc.lat(), lng: loc.lng() },
        addressLine:
          place.formattedAddress?.split(',')[0] ??
          `${get('street_number')} ${get('route')}`.trim(),
        area:
          get('sublocality_level_1') ||
          get('sublocality') ||
          get('neighborhood') ||
          get('locality'),
        district:
          get('administrative_area_level_2') ||
          get('administrative_area_level_1') ||
          get('locality'),
        zipCode: get('postal_code'),
      });
    };

    container.replaceChildren(el);
    el.addEventListener('gmp-select', handler as EventListener);
    // Backward compatibility for older beta event naming.
    el.addEventListener('gmp-placeselect', handler as EventListener);

    return () => {
      el.removeEventListener('gmp-select', handler as EventListener);
      el.removeEventListener('gmp-placeselect', handler as EventListener);
      el.remove();
    };
  }, [containerRef, placesLibrary]);
}
