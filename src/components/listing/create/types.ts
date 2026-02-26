import type { DetailsFacingDirection, ListingCreateRequest } from '@/api/model';

export type OptionalBooleanChoice = 'unset' | 'true' | 'false';
export type FacingDirectionChoice =
  | NonNullable<DetailsFacingDirection>
  | 'none';

export type MediaDraft = {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
};

export type ListingCreateFormState = {
  title: string;
  description: string;
  propertyType: ListingCreateRequest['propertyType'] | '';
  pricing: string;
  details: {
    yearBuilt: string;
    listingCondition: ListingCreateRequest['details']['listingCondition'] | '';
    facingDirection: FacingDirectionChoice;
    bedroomsCount: string;
    bathroomsCount: string;
    balconiesCount: string;
    floorLevel: string;
    furnished: OptionalBooleanChoice;
    parkingArea: string;
    petFriendly: OptionalBooleanChoice;
    lotArea: string;
    livingArea: string;
  };
  location: {
    addressLine: string;
    area: string;
    district: string;
    zipCode: string;
    latitude: string;
    longitude: string;
  };
};

export type SubmitMode = 'draft' | 'publish';

export type SubmitStage =
  | 'idle'
  | 'uploading'
  | 'submitting'
  | 'success'
  | 'error';

export type SubmitState = {
  mode: SubmitMode | null;
  stage: SubmitStage;
  message: string | null;
};

export type SetTopField = <K extends keyof ListingCreateFormState>(
  key: K,
  value: ListingCreateFormState[K]
) => void;

export type SetDetailsField = <
  K extends keyof ListingCreateFormState['details'],
>(
  key: K,
  value: ListingCreateFormState['details'][K]
) => void;

export type SetLocationField = <
  K extends keyof ListingCreateFormState['location'],
>(
  key: K,
  value: ListingCreateFormState['location'][K]
) => void;
