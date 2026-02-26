import type { RefObject } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
} from 'lucide-react';
import fallbackPreview from '@/assets/logos/img_addLocation.svg';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  FACING_DIRECTIONS,
  LISTING_CONDITIONS,
  PROPERTY_TYPES,
} from './constants';
import { FieldLabel, SectionTitle } from './shared';
import type {
  FacingDirectionChoice,
  ListingCreateFormState,
  MediaDraft,
  OptionalBooleanChoice,
  SetDetailsField,
  SetLocationField,
  SetTopField,
} from './types';
import { LocationPicker } from '@/components/map/LocationPicker';
import { formatLabel } from './utils';

type BasicInformationSectionProps = {
  title: string;
  propertyType: ListingCreateFormState['propertyType'];
  pricing: string;
  description: string;
  setTopField: SetTopField;
};

export function BasicInformationSection({
  title,
  propertyType,
  pricing,
  description,
  setTopField,
}: BasicInformationSectionProps) {
  return (
    <Card className="rounded-2xl border-custom-gray-300/50 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-custom-gray-300/40 px-5 py-5 md:px-6">
        <SectionTitle
          title="Basic Information"
          description="Core listing metadata and pricing shown to buyers first."
          icon={<Sparkles className="size-4" />}
        />
      </CardHeader>
      <CardContent className="space-y-5 px-5 py-5 md:px-6 md:py-6">
        <div className="space-y-2">
          <FieldLabel label="Listing title" required />
          <Input
            value={title}
            onChange={(e) => setTopField('title', e.target.value)}
            placeholder="Modern 3BR Apartment in Gulshan"
            className="h-11 border-custom-gray-300 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel label="Property type" required />
            <Select
              value={propertyType || '__unset'}
              onValueChange={(value) =>
                setTopField(
                  'propertyType',
                  value === '__unset'
                    ? ''
                    : (value as ListingCreateFormState['propertyType'])
                )
              }
            >
              <SelectTrigger className="h-11 w-full border-custom-gray-300 bg-white">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__unset">Select property type</SelectItem>
                {PROPERTY_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {formatLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FieldLabel label="Pricing (BDT)" required />
            <Input
              type="number"
              min="0"
              step="0.01"
              value={pricing}
              onChange={(e) => setTopField('pricing', e.target.value)}
              placeholder="4500000"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <FieldLabel label="Description" />
          <Textarea
            value={description}
            onChange={(e) => setTopField('description', e.target.value)}
            placeholder="Describe the property, neighborhood highlights, condition, amenities, and notable features..."
            className="min-h-30 border-custom-gray-300 bg-white"
          />
        </div>
      </CardContent>
    </Card>
  );
}

type PropertyDetailsSectionProps = {
  details: ListingCreateFormState['details'];
  setDetailsField: SetDetailsField;
};

export function PropertyDetailsSection({
  details,
  setDetailsField,
}: PropertyDetailsSectionProps) {
  return (
    <Card className="rounded-2xl border-custom-gray-300/50 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-custom-gray-300/40 px-5 py-5 md:px-6">
        <SectionTitle
          title="Property Details"
          description="Physical specs and condition details used in listing cards and filters."
          icon={<ShieldCheck className="size-4" />}
        />
      </CardHeader>
      <CardContent className="space-y-5 px-5 py-5 md:px-6 md:py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <FieldLabel label="Year built" required />
            <Input
              type="number"
              value={details.yearBuilt}
              onChange={(e) => setDetailsField('yearBuilt', e.target.value)}
              placeholder="2020"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>

          <div className="space-y-2">
            <FieldLabel label="Listing condition" required />
            <Select
              value={details.listingCondition || '__unset'}
              onValueChange={(value) =>
                setDetailsField(
                  'listingCondition',
                  value === '__unset'
                    ? ''
                    : (value as ListingCreateFormState['details']['listingCondition'])
                )
              }
            >
              <SelectTrigger className="h-11 w-full border-custom-gray-300 bg-white">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__unset">Select condition</SelectItem>
                {LISTING_CONDITIONS.map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {formatLabel(condition)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FieldLabel label="Facing direction" />
            <Select
              value={details.facingDirection}
              onValueChange={(value) =>
                setDetailsField(
                  'facingDirection',
                  value as FacingDirectionChoice
                )
              }
            >
              <SelectTrigger className="h-11 w-full border-custom-gray-300 bg-white">
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Not specified</SelectItem>
                {FACING_DIRECTIONS.map((direction) => (
                  <SelectItem key={direction} value={direction}>
                    {formatLabel(direction)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          <div className="space-y-2">
            <FieldLabel label="Bedrooms" required />
            <Input
              type="number"
              min="0"
              step="1"
              value={details.bedroomsCount}
              onChange={(e) => setDetailsField('bedroomsCount', e.target.value)}
              placeholder="3"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Bathrooms" required />
            <Input
              type="number"
              min="0"
              step="1"
              value={details.bathroomsCount}
              onChange={(e) =>
                setDetailsField('bathroomsCount', e.target.value)
              }
              placeholder="2"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Balconies" required />
            <Input
              type="number"
              min="0"
              step="1"
              value={details.balconiesCount}
              onChange={(e) =>
                setDetailsField('balconiesCount', e.target.value)
              }
              placeholder="1"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Floor level" />
            <Input
              type="number"
              step="1"
              value={details.floorLevel}
              onChange={(e) => setDetailsField('floorLevel', e.target.value)}
              placeholder="7"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="space-y-2">
            <FieldLabel label="Living area (sqft)" required />
            <Input
              type="number"
              min="0"
              step="1"
              value={details.livingArea}
              onChange={(e) => setDetailsField('livingArea', e.target.value)}
              placeholder="1450"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Lot area (sqft)" />
            <Input
              type="number"
              min="0"
              step="1"
              value={details.lotArea}
              onChange={(e) => setDetailsField('lotArea', e.target.value)}
              placeholder="2000"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Parking area" />
            <Input
              type="number"
              min="0"
              step="1"
              value={details.parkingArea}
              onChange={(e) => setDetailsField('parkingArea', e.target.value)}
              placeholder="1"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel label="Furnished" />
            <Select
              value={details.furnished}
              onValueChange={(value) =>
                setDetailsField('furnished', value as OptionalBooleanChoice)
              }
            >
              <SelectTrigger className="h-11 w-full border-custom-gray-300 bg-white">
                <SelectValue placeholder="Not specified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unset">Not specified</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <FieldLabel label="Pet friendly" />
            <Select
              value={details.petFriendly}
              onValueChange={(value) =>
                setDetailsField('petFriendly', value as OptionalBooleanChoice)
              }
            >
              <SelectTrigger className="h-11 w-full border-custom-gray-300 bg-white">
                <SelectValue placeholder="Not specified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unset">Not specified</SelectItem>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type LocationSectionProps = {
  location: ListingCreateFormState['location'];
  setLocationField: SetLocationField;
};

export function LocationSection({
  location,
  setLocationField,
}: LocationSectionProps) {
  return (
    <Card className="rounded-2xl border-custom-gray-300/50 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-custom-gray-300/40 px-5 py-5 md:px-6">
        <SectionTitle
          title="Location"
          description="Property address and coordinates used for search and map display."
          icon={<MapPin className="size-4" />}
        />
      </CardHeader>
      <CardContent className="space-y-5 px-5 py-5 md:px-6 md:py-6">
        <LocationPicker
          location={location}
          setLocationField={setLocationField}
        />

        <div className="space-y-2">
          <FieldLabel label="Address line" required />
          <Input
            value={location.addressLine}
            onChange={(e) => setLocationField('addressLine', e.target.value)}
            placeholder="House 12, Road 5, Block F"
            className="h-11 border-custom-gray-300 bg-white"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <FieldLabel label="Area" required />
            <Input
              value={location.area}
              onChange={(e) => setLocationField('area', e.target.value)}
              placeholder="Gulshan 2"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="District" required />
            <Input
              value={location.district}
              onChange={(e) => setLocationField('district', e.target.value)}
              placeholder="Dhaka"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <FieldLabel label="Zip code" required />
            <Input
              value={location.zipCode}
              onChange={(e) => setLocationField('zipCode', e.target.value)}
              placeholder="1212"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Latitude" required />
            <Input
              type="number"
              step="0.000001"
              value={location.latitude}
              onChange={(e) => setLocationField('latitude', e.target.value)}
              placeholder="23.780000"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
          <div className="space-y-2">
            <FieldLabel label="Longitude" required />
            <Input
              type="number"
              step="0.000001"
              value={location.longitude}
              onChange={(e) => setLocationField('longitude', e.target.value)}
              placeholder="90.420000"
              className="h-11 border-custom-gray-300 bg-white"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

type MediaUploadsSectionProps = {
  mediaItems: MediaDraft[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  onAddFiles: (files: FileList | null) => void;
  onMoveMediaItem: (id: string, direction: 'up' | 'down') => void;
  onRemoveMediaItem: (id: string) => void;
  onUpdateMediaCaption: (id: string, caption: string) => void;
};

export function MediaUploadsSection({
  mediaItems,
  fileInputRef,
  onAddFiles,
  onMoveMediaItem,
  onRemoveMediaItem,
  onUpdateMediaCaption,
}: MediaUploadsSectionProps) {
  return (
    <Card className="rounded-2xl border-custom-gray-300/50 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-custom-gray-300/40 px-5 py-5 md:px-6">
        <SectionTitle
          title="Media Uploads"
          description="Upload images or videos. Files are uploaded to S3 first, then attached to the listing."
          icon={<ImagePlus className="size-4" />}
        />
      </CardHeader>
      <CardContent className="space-y-5 px-5 py-5 md:px-6 md:py-6">
        <div className="rounded-2xl border border-dashed border-custom-gray-300 bg-custom-bg-warm-3/70 p-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(e) => onAddFiles(e.target.files)}
          />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-custom-orange shadow-sm">
                <UploadCloud className="size-5" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-custom-dark">
                  Add property photos or videos
                </p>
                <p className="text-xs font-semibold leading-5 text-custom-gray-700">
                  Supported: images/videos. The first item becomes the cover
                  image in most list views.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="border-custom-gray-300 bg-white cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Plus className="size-4" />
              Add Files
            </Button>
          </div>
        </div>

        {mediaItems.length === 0 ? (
          <div className="rounded-2xl border border-custom-gray-300/40 bg-white p-6 text-center">
            <img
              src={fallbackPreview}
              alt=""
              aria-hidden="true"
              className="mx-auto mb-3 size-10 opacity-80"
            />
            <p className="text-sm font-semibold text-custom-gray-700">
              No media selected yet. You can still create a listing without
              media and add them later.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {mediaItems.map((item, index) => {
              const isVideo = item.file.type.startsWith('video/');

              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-2xl border border-custom-gray-300/50 bg-white"
                >
                  <div className="grid grid-cols-1 gap-0 md:grid-cols-[200px_minmax(0,1fr)]">
                    <div className="relative h-44 bg-custom-bg-warm-3">
                      {isVideo ? (
                        <video
                          src={item.previewUrl}
                          className="h-full w-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={item.previewUrl}
                          alt={item.file.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                      {index === 0 && (
                        <Badge className="absolute left-3 top-3 border-0 bg-custom-orange text-white">
                          Cover
                        </Badge>
                      )}
                    </div>

                    <div className="space-y-4 p-4">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-custom-dark">
                            {item.file.name}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-custom-gray-600">
                            {(item.file.size / 1024).toFixed(1)} KB •{' '}
                            {item.file.type || 'Unknown type'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            className="border-custom-gray-300 bg-white cursor-pointer"
                            onClick={() => onMoveMediaItem(item.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            className="border-custom-gray-300 bg-white cursor-pointer"
                            onClick={() => onMoveMediaItem(item.id, 'down')}
                            disabled={index === mediaItems.length - 1}
                          >
                            <ArrowDown className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon-sm"
                            className="border-red-200 bg-white text-red-600 hover:text-red-700 cursor-pointer"
                            onClick={() => onRemoveMediaItem(item.id)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <FieldLabel
                          label={`Caption (optional) • Sort order ${index}`}
                        />
                        <Input
                          value={item.caption}
                          onChange={(e) =>
                            onUpdateMediaCaption(item.id, e.target.value)
                          }
                          placeholder="Living room with panoramic windows"
                          className="h-10 border-custom-gray-300 bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
