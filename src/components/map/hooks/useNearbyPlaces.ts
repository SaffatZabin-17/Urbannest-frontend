import { useCallback, useRef, useState } from 'react';
import { useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import {
  NEARBY_RADIUS_METERS,
  PLACE_CATEGORIES,
  type PlaceCategoryId,
} from '../constants';
import type { LatLng, NearbyPlace } from '../types';

type NearbyState = {
  activeCategories: Set<PlaceCategoryId>;
  cache: Record<string, NearbyPlace[]>;
  loading: Set<PlaceCategoryId>;
  showOverlay: boolean;
};

export function useNearbyPlaces(center: LatLng) {
  const map = useMap();
  const placesLib = useMapsLibrary('places');

  const [state, setState] = useState<NearbyState>({
    activeCategories: new Set(),
    cache: {},
    loading: new Set(),
    showOverlay: false,
  });

  const serviceRef = useRef<google.maps.places.PlacesService | null>(null);

  const getService = useCallback(() => {
    if (serviceRef.current) return serviceRef.current;
    if (!placesLib || !map) return null;
    serviceRef.current = new placesLib.PlacesService(map);
    return serviceRef.current;
  }, [placesLib, map]);

  const searchCategory = useCallback(
    (categoryId: PlaceCategoryId) => {
      const service = getService();
      if (!service) return;

      const category = PLACE_CATEGORIES.find((c) => c.id === categoryId);
      if (!category) return;

      setState((prev) => ({
        ...prev,
        loading: new Set(prev.loading).add(categoryId),
      }));

      service.nearbySearch(
        {
          location: center,
          radius: NEARBY_RADIUS_METERS,
          type: category.type,
        },
        (results, status) => {
          const places: NearbyPlace[] = [];

          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            for (const r of results) {
              const loc = r.geometry?.location;
              if (!loc || !r.place_id) continue;
              places.push({
                id: r.place_id,
                name: r.name ?? 'Unknown',
                location: { lat: loc.lat(), lng: loc.lng() },
                categoryId,
              });
            }
          }

          setState((prev) => {
            const nextLoading = new Set(prev.loading);
            nextLoading.delete(categoryId);
            return {
              ...prev,
              cache: { ...prev.cache, [categoryId]: places },
              loading: nextLoading,
            };
          });
        }
      );
    },
    [center, getService]
  );

  const toggleCategory = useCallback(
    (categoryId: PlaceCategoryId) => {
      setState((prev) => {
        const next = new Set(prev.activeCategories);
        if (next.has(categoryId)) {
          next.delete(categoryId);
        } else {
          next.add(categoryId);
          if (!prev.cache[categoryId]) {
            searchCategory(categoryId);
          }
        }
        return {
          ...prev,
          activeCategories: next,
          showOverlay: next.size > 0 ? true : prev.showOverlay,
        };
      });
    },
    [searchCategory]
  );

  const toggleOverlay = useCallback(() => {
    setState((prev) => ({ ...prev, showOverlay: !prev.showOverlay }));
  }, []);

  const visiblePlaces: NearbyPlace[] = state.showOverlay
    ? Array.from(state.activeCategories).flatMap((id) => state.cache[id] ?? [])
    : [];

  return {
    activeCategories: state.activeCategories,
    loading: state.loading,
    showOverlay: state.showOverlay,
    visiblePlaces,
    toggleCategory,
    toggleOverlay,
  };
}
