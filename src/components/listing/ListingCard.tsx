import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Maximize } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ListingResponse } from '@/api/model';

import placeholderImg from '@/assets/logos/img_image_1.png';

interface ListingCardProps {
  listing: ListingResponse;
}

function formatPrice(price?: number) {
  if (price == null) return 'N/A';
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(price);
}

function capitalize(s?: string) {
  if (!s) return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ListingCard({ listing }: ListingCardProps) {
  const thumbnail =
    listing.media?.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))[0]
      ?.url ?? placeholderImg;

  return (
    <Link
      to={`/listing/${listing.listingId}`}
      className="group rounded-2xl overflow-hidden border border-custom-gray-300/60 shadow-sm hover:shadow-custom transition-shadow bg-white"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={listing.title ?? 'Property'}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {listing.propertyType && (
          <Badge className="absolute top-3 left-3 bg-custom-orange text-white text-xs font-semibold border-0">
            {capitalize(listing.propertyType)}
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-bold text-custom-dark leading-tight line-clamp-1">
          {listing.title ?? 'Untitled Listing'}
        </h3>

        <p className="text-sm text-custom-gray-600 flex items-center gap-1.5">
          <MapPin className="size-3.5 shrink-0" />
          <span className="line-clamp-1">
            {listing.location
              ? `${listing.location.area}, ${listing.location.district}`
              : 'Location not specified'}
          </span>
        </p>

        {/* Property details */}
        <div className="flex items-center gap-4 text-sm text-custom-gray-700">
          {listing.details?.bedroomsCount != null && (
            <span className="flex items-center gap-1">
              <BedDouble className="size-4 text-custom-orange" />
              {listing.details.bedroomsCount} Beds
            </span>
          )}
          {listing.details?.bathroomsCount != null && (
            <span className="flex items-center gap-1">
              <Bath className="size-4 text-custom-orange" />
              {listing.details.bathroomsCount} Baths
            </span>
          )}
          {listing.details?.livingArea != null && (
            <span className="flex items-center gap-1">
              <Maximize className="size-4 text-custom-orange" />
              {listing.details.livingArea} sqft
            </span>
          )}
        </div>

        {/* Price */}
        <p className="text-lg font-extrabold text-custom-orange">
          {formatPrice(listing.pricing)}
        </p>
      </div>
    </Link>
  );
}
