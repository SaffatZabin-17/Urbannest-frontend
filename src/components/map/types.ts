export type LatLng = {
  lat: number;
  lng: number;
};

export type GeocodedAddress = {
  addressLine: string;
  area: string;
  district: string;
  zipCode: string;
};

export type NearbyPlace = {
  id: string;
  name: string;
  location: LatLng;
  categoryId: string;
};
