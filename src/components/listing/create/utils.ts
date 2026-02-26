import type { ListingCreateRequest, MediaItem } from '@/api/model';
import type {
  ListingCreateFormState,
  MediaDraft,
  OptionalBooleanChoice,
} from './types';

function parseRequiredNumber(
  label: string,
  value: string,
  errors: string[],
  options?: { integer?: boolean }
) {
  if (!value.trim()) {
    errors.push(`${label} is required.`);
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    errors.push(`${label} must be a valid number.`);
    return null;
  }

  if (options?.integer && !Number.isInteger(parsed)) {
    errors.push(`${label} must be a whole number.`);
    return null;
  }

  return parsed;
}

function parseOptionalNumber(
  label: string,
  value: string,
  errors: string[],
  options?: { integer?: boolean }
) {
  if (!value.trim()) return undefined;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    errors.push(`${label} must be a valid number.`);
    return undefined;
  }

  if (options?.integer && !Number.isInteger(parsed)) {
    errors.push(`${label} must be a whole number.`);
    return undefined;
  }

  return parsed;
}

function toOptionalBoolean(choice: OptionalBooleanChoice) {
  if (choice === 'unset') return undefined;
  return choice === 'true';
}

export function formatLabel(value: string) {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function revokeMediaPreviews(items: MediaDraft[]) {
  items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
}

export function buildListingPayload(
  form: ListingCreateFormState,
  medias: MediaItem[],
  isPublishing: boolean
): { payload: ListingCreateRequest | null; errors: string[] } {
  const errors: string[] = [];

  const title = form.title.trim();
  const description = form.description.trim();
  const addressLine = form.location.addressLine.trim();
  const area = form.location.area.trim();
  const district = form.location.district.trim();
  const zipCode = form.location.zipCode.trim();

  if (!title) errors.push('Title is required.');
  if (!form.propertyType) errors.push('Property type is required.');
  if (!form.details.listingCondition)
    errors.push('Listing condition is required.');
  if (!addressLine) errors.push('Address line is required.');
  if (!area) errors.push('Area is required.');
  if (!district) errors.push('District is required.');
  if (!zipCode) errors.push('Zip code is required.');

  const pricing = parseRequiredNumber('Pricing', form.pricing, errors);
  const yearBuilt = parseRequiredNumber(
    'Year built',
    form.details.yearBuilt,
    errors,
    {
      integer: true,
    }
  );
  const bedroomsCount = parseRequiredNumber(
    'Bedrooms count',
    form.details.bedroomsCount,
    errors,
    { integer: true }
  );
  const bathroomsCount = parseRequiredNumber(
    'Bathrooms count',
    form.details.bathroomsCount,
    errors,
    { integer: true }
  );
  const balconiesCount = parseRequiredNumber(
    'Balconies count',
    form.details.balconiesCount,
    errors,
    { integer: true }
  );
  const livingArea = parseRequiredNumber(
    'Living area',
    form.details.livingArea,
    errors,
    { integer: true }
  );
  const latitude = parseRequiredNumber(
    'Latitude',
    form.location.latitude,
    errors
  );
  const longitude = parseRequiredNumber(
    'Longitude',
    form.location.longitude,
    errors
  );

  const floorLevel = parseOptionalNumber(
    'Floor level',
    form.details.floorLevel,
    errors,
    { integer: true }
  );
  const parkingArea = parseOptionalNumber(
    'Parking area',
    form.details.parkingArea,
    errors,
    { integer: true }
  );
  const lotArea = parseOptionalNumber(
    'Lot area',
    form.details.lotArea,
    errors,
    {
      integer: true,
    }
  );

  if (errors.length > 0) {
    return { payload: null, errors };
  }

  const payload: ListingCreateRequest = {
    title,
    description: description || undefined,
    propertyType: form.propertyType as NonNullable<
      ListingCreateRequest['propertyType']
    >,
    pricing: pricing as number,
    isPublishing,
    details: {
      yearBuilt: yearBuilt as number,
      listingCondition: form.details.listingCondition as NonNullable<
        ListingCreateRequest['details']['listingCondition']
      >,
      facingDirection:
        form.details.facingDirection === 'none'
          ? undefined
          : form.details.facingDirection,
      bedroomsCount: bedroomsCount as number,
      bathroomsCount: bathroomsCount as number,
      balconiesCount: balconiesCount as number,
      floorLevel,
      furnished: toOptionalBoolean(form.details.furnished),
      parkingArea,
      petFriendly: toOptionalBoolean(form.details.petFriendly),
      lotArea,
      livingArea: livingArea as number,
    },
    location: {
      addressLine,
      area,
      district,
      zipCode,
      latitude: latitude as number,
      longitude: longitude as number,
    },
    medias: medias.length > 0 ? medias : undefined,
  };

  return { payload, errors: [] };
}
