import {
  DetailsFacingDirection,
  DetailsListingCondition,
  ListingCreateRequestPropertyType,
} from '@/api/model';
import type { ListingCreateFormState, SubmitState } from './types';

export const PROPERTY_TYPES = Object.values(ListingCreateRequestPropertyType);
export const LISTING_CONDITIONS = Object.values(DetailsListingCondition);
export const FACING_DIRECTIONS = Object.values(DetailsFacingDirection);

export const DEFAULT_PAGE_METADATA = {
  title: 'Create a new property listing',
};

export const createInitialListingCreateFormState =
  (): ListingCreateFormState => ({
    title: '',
    description: '',
    propertyType: '',
    pricing: '',
    details: {
      yearBuilt: '',
      listingCondition: '',
      facingDirection: 'none',
      bedroomsCount: '',
      bathroomsCount: '',
      balconiesCount: '',
      floorLevel: '',
      furnished: 'unset',
      parkingArea: '',
      petFriendly: 'unset',
      lotArea: '',
      livingArea: '',
    },
    location: {
      addressLine: '',
      area: '',
      district: '',
      zipCode: '',
      latitude: '',
      longitude: '',
    },
  });

export const IDLE_SUBMIT_STATE: SubmitState = {
  mode: null,
  stage: 'idle',
  message: null,
};
