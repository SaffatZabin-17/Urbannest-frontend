import { useMemo, useState } from 'react';
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  Pin,
} from '@vis.gl/react-google-maps';
import { MapProvider } from './MapProvider';
import { useNearbyPlaces } from './hooks';
import { NearbyPlacesToolbar } from './NearbyPlacesToolbar';
import { RadiusCircle } from './RadiusCircle';
import { GOOGLE_MAP_ID, PLACE_CATEGORIES, SELECTED_ZOOM } from './constants';
import type { Location } from '@/api/model/location';
import type { LatLng, NearbyPlace } from './types';

type LocationViewerProps = {
  location: Location;
};

export function LocationViewer({ location }: LocationViewerProps) {
  return (
    <MapProvider>
      <LocationViewerInner location={location} />
    </MapProvider>
  );
}

function LocationViewerInner({ location }: LocationViewerProps) {
  const center: LatLng = useMemo(
    () => ({ lat: location.latitude, lng: location.longitude }),
    [location.latitude, location.longitude]
  );

  const {
    activeCategories,
    loading,
    showOverlay,
    visiblePlaces,
    toggleCategory,
    toggleOverlay,
  } = useNearbyPlaces(center);

  const [listingInfoOpen, setListingInfoOpen] = useState(false);
  const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null);

  const addressLabel = `${location.addressLine}, ${location.area}`;
  const addressSubtitle = `${location.district} ${location.zipCode}`;
  const hasActiveCategories = activeCategories.size > 0;

  return (
    <div className="space-y-3">
      <NearbyPlacesToolbar
        activeCategories={activeCategories}
        loading={loading}
        showOverlay={showOverlay}
        onToggleCategory={toggleCategory}
        onToggleOverlay={toggleOverlay}
      />

      <div className="h-[400px] w-full overflow-hidden rounded-xl border border-custom-gray-300">
        <Map
          mapId={GOOGLE_MAP_ID}
          defaultCenter={center}
          defaultZoom={SELECTED_ZOOM}
          gestureHandling="greedy"
          disableDefaultUI={false}
          className="h-full w-full"
        >
          <AdvancedMarker
            position={center}
            onClick={() => setListingInfoOpen((prev) => !prev)}
          >
            <Pin background="#EF4444" borderColor="#991B1B" glyphColor="#fff" />
          </AdvancedMarker>

          {listingInfoOpen && (
            <InfoWindow
              position={center}
              onCloseClick={() => setListingInfoOpen(false)}
            >
              <div className="max-w-[220px] p-1">
                <p className="text-sm font-bold text-custom-dark">
                  {addressLabel}
                </p>
                <p className="text-xs text-custom-gray-700">
                  {addressSubtitle}
                </p>
              </div>
            </InfoWindow>
          )}

          {hasActiveCategories && showOverlay && (
            <RadiusCircle center={center} visible />
          )}

          {visiblePlaces.map((place) => (
            <NearbyPlaceMarker
              key={place.id}
              place={place}
              isHovered={hoveredPlaceId === place.id}
              onHover={setHoveredPlaceId}
            />
          ))}
        </Map>
      </div>
    </div>
  );
}

function NearbyPlaceMarker({
  place,
  isHovered,
  onHover,
}: {
  place: NearbyPlace;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const category = PLACE_CATEGORIES.find((c) => c.id === place.categoryId);
  const color = category?.color ?? '#6B7280';

  return (
    <>
      <AdvancedMarker
        position={place.location}
        onClick={() => onHover(isHovered ? null : place.id)}
        onMouseEnter={() => onHover(place.id)}
        onMouseLeave={() => onHover(null)}
      >
        <Pin
          background={color}
          borderColor={color}
          glyphColor="#fff"
          scale={0.8}
        />
      </AdvancedMarker>

      {isHovered && (
        <InfoWindow
          position={place.location}
          onCloseClick={() => onHover(null)}
        >
          <div className="max-w-[180px] p-1">
            <p className="text-xs font-bold text-custom-dark">{place.name}</p>
            <p className="text-[10px] text-custom-gray-700">
              {category?.label}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
