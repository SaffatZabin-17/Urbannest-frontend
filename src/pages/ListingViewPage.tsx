import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  Bath,
  BedDouble,
  Bookmark,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Compass,
  ExternalLink,
  Eye,
  Heart,
  Images,
  MapPin,
  Maximize,
  Plus,
  Sofa,
  UserRound,
} from 'lucide-react';
import { getListingById } from '@/api/generated';
import type { ListingResponse, Media } from '@/api/model';
import heroBg from '@/assets/logos/img_search_page_image.jpg';
import heroImage from '@/assets/logos/img_coverimage.png';
import mapOverlay from '@/assets/logos/img_map.png';
import placeholderImg from '@/assets/logos/img_image_1.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { LocationViewer } from '@/components/map/LocationViewer';

type FetchState = {
  status: 'idle' | 'success' | 'error';
  key: string;
  listing: ListingResponse | null;
  error: string | null;
};

type GalleryItem = {
  key: string;
  url: string;
  contentType?: string;
};

function formatPrice(price?: number) {
  if (price == null) return 'Price not available';
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(price);
}

function formatNumber(value?: number) {
  if (value == null) return '0';
  return new Intl.NumberFormat('en-US').format(value);
}

function formatEnumLabel(value?: string) {
  if (!value) return 'N/A';
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function formatDate(value?: string) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getStatusBadgeClass(status?: string) {
  switch (status) {
    case 'published':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700';
    case 'draft':
      return 'border-amber-200 bg-amber-50 text-amber-700';
    case 'pending':
      return 'border-blue-200 bg-blue-50 text-blue-700';
    case 'sold':
      return 'border-rose-200 bg-rose-50 text-rose-700';
    case 'archived':
      return 'border-custom-gray-300 bg-white text-custom-gray-700';
    default:
      return 'border-custom-gray-300 bg-white text-custom-dark';
  }
}

function isTruthyBoolean(value?: boolean) {
  return value === true;
}

function OwnerInitials(name?: string) {
  if (!name) return 'UN';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
  return initials || 'UN';
}

function buildGalleryItems(media?: Media[]): GalleryItem[] {
  const ordered = [...(media ?? [])]
    .filter((item) => !!item.url)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  if (ordered.length === 0) {
    return [
      { key: 'placeholder', url: placeholderImg, contentType: 'image/png' },
    ];
  }

  return ordered.map((item, index) => ({
    key: item.mediaId ?? `${item.url}-${index}`,
    url: item.url as string,
    contentType: item.contentType,
  }));
}

function ListingGallery({ media, title }: { media?: Media[]; title?: string }) {
  const items = useMemo(() => buildGalleryItems(media), [media]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedItem = items[selectedIndex] ?? items[0];

  const isVideo = selectedItem.contentType?.startsWith('video/');

  const canNavigate = items.length > 1;
  const goPrev = () =>
    setSelectedIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  const goNext = () =>
    setSelectedIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));

  return (
    <div className="overflow-hidden rounded-2xl border border-custom-gray-300/50 bg-white shadow-sm">
      <div className="relative">
        <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
          <Badge className="border border-white/30 bg-black/55 text-white">
            <Images className="mr-1 size-3.5" />
            {items.length} Media
          </Badge>
        </div>

        {canNavigate && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition hover:bg-black/65"
              aria-label="Previous media"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/50 text-white transition hover:bg-black/65"
              aria-label="Next media"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}

        <div className="h-[260px] bg-custom-bg-warm-3 md:h-[400px]">
          {isVideo ? (
            <video
              src={selectedItem.url}
              controls
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={selectedItem.url}
              alt={title ?? 'Listing media'}
              className="h-full w-full object-cover"
            />
          )}
        </div>
      </div>

      {items.length > 1 && (
        <div className="grid grid-cols-3 gap-3 p-4 sm:grid-cols-4 lg:grid-cols-5">
          {items.map((item, index) => {
            const thumbIsVideo = item.contentType?.startsWith('video/');
            const isActive = index === selectedIndex;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`relative h-18 overflow-hidden rounded-xl border transition ${
                  isActive
                    ? 'border-custom-orange ring-2 ring-custom-orange/20'
                    : 'border-custom-gray-300/70 hover:border-custom-orange/40'
                }`}
                aria-label={`View media ${index + 1}`}
              >
                {thumbIsVideo ? (
                  <div className="flex h-full w-full items-center justify-center bg-custom-dark text-white">
                    <span className="text-xs font-bold uppercase tracking-[0.08em]">
                      Video
                    </span>
                  </div>
                ) : (
                  <img
                    src={item.url}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LoadingView() {
  return (
    <div className="flex flex-col bg-custom-bg-warm-1">
      <section className="relative overflow-hidden px-5 py-10 lg:px-30">
        <div className="absolute inset-0 bg-gradient-to-r from-custom-bg-warm-1 via-custom-bg-warm-1/95 to-custom-bg-warm-1/85" />
        <div className="relative mx-auto max-w-7xl space-y-4">
          <div className="h-5 w-32 animate-pulse rounded bg-custom-bg-warm-3" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-custom-bg-warm-3" />
          <div className="h-5 w-1/2 animate-pulse rounded bg-custom-bg-warm-3" />
        </div>
      </section>
      <section className="px-5 pb-16 lg:px-30">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="h-[460px] animate-pulse rounded-2xl border border-custom-gray-300/50 bg-white" />
            <div className="h-64 animate-pulse rounded-2xl border border-custom-gray-300/50 bg-white" />
            <div className="h-72 animate-pulse rounded-2xl border border-custom-gray-300/50 bg-white" />
          </div>
          <div className="space-y-6">
            <div className="h-80 animate-pulse rounded-2xl border border-custom-gray-300/50 bg-white" />
            <div className="h-56 animate-pulse rounded-2xl border border-custom-gray-300/50 bg-white" />
          </div>
        </div>
      </section>
    </div>
  );
}

function ErrorView({ message }: { message: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center bg-custom-bg-warm-1 px-5 py-16 text-center">
      <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle className="size-6" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-custom-dark">
          Unable to load listing
        </h1>
        <p className="mt-3 text-sm font-semibold leading-6 text-custom-gray-700">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            className="bg-custom-dark text-white hover:bg-custom-dark/90"
          >
            <Link to="/listing">
              <ArrowLeft className="size-4" />
              Back to Listings
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-custom-gray-300 bg-white"
          >
            <Link to="/listing/create">
              <Plus className="size-4" />
              Create Listing
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-custom-gray-300/50 bg-white px-4 py-3 shadow-sm">
      <div className="flex size-10 items-center justify-center rounded-full bg-custom-orange/10 text-custom-orange">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-custom-gray-600">
          {label}
        </p>
        <p className="text-sm font-extrabold text-custom-dark">{value}</p>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-custom-gray-300/40 bg-custom-bg-warm-2 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.1em] text-custom-gray-600">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-custom-dark">{value}</p>
    </div>
  );
}

export default function ListingViewPage() {
  const { id } = useParams<{ id: string }>();
  const listingId = id?.trim() ?? '';

  const [fetchState, setFetchState] = useState<FetchState>({
    status: 'idle',
    key: '',
    listing: null,
    error: null,
  });

  useEffect(() => {
    if (!listingId) return;

    const controller = new AbortController();
    let ignore = false;

    getListingById(listingId, { signal: controller.signal })
      .then((response) => {
        if (ignore) return;
        setFetchState({
          status: 'success',
          key: listingId,
          listing: response.data,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (ignore) return;
        if (error instanceof DOMException && error.name === 'AbortError')
          return;

        setFetchState({
          status: 'error',
          key: listingId,
          listing: null,
          error:
            error instanceof Error
              ? error.message
              : 'Failed to fetch listing details.',
        });
      });

    return () => {
      ignore = true;
      controller.abort();
    };
  }, [listingId]);

  if (!listingId) {
    return <ErrorView message="Invalid listing identifier." />;
  }

  const loading = fetchState.status === 'idle' || fetchState.key !== listingId;
  const listing = fetchState.key === listingId ? fetchState.listing : null;
  const error = fetchState.key === listingId ? fetchState.error : null;

  if (loading) return <LoadingView />;
  if (error || !listing)
    return <ErrorView message={error ?? 'Listing not found.'} />;

  const locationLabel = listing.location
    ? `${listing.location.area}, ${listing.location.district}`
    : 'Location unavailable';

  const fullAddress = listing.location
    ? `${listing.location.addressLine}, ${listing.location.area}, ${listing.location.district} ${listing.location.zipCode}`
    : 'Address unavailable';

  const mapHref =
    listing.location?.latitude != null && listing.location.longitude != null
      ? `https://www.google.com/maps/search/?api=1&query=${listing.location.latitude},${listing.location.longitude}`
      : null;

  return (
    <div className="flex flex-col bg-custom-bg-warm-1">
      <section className="relative overflow-hidden px-5 py-10 lg:px-30 lg:py-14">
        <div className="absolute inset-0">
          <img
            src={heroBg}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-[0.14]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-custom-bg-warm-1 via-custom-bg-warm-1/95 to-custom-bg-warm-1/88" />
        </div>
        <img
          src={mapOverlay}
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-[0.05]"
        />

        <div className="relative mx-auto max-w-7xl space-y-6">
          <Button
            asChild
            variant="outline"
            className="border-custom-gray-300 bg-white/90 backdrop-blur-sm"
          >
            <Link to="/listing">
              <ArrowLeft className="size-4" />
              Back to Listings
            </Link>
          </Button>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {listing.propertyType && (
                  <Badge className="border border-custom-orange/20 bg-custom-orange/10 text-custom-orange">
                    <Building2 className="mr-1 size-3.5" />
                    {formatEnumLabel(listing.propertyType)}
                  </Badge>
                )}
                {listing.propertyStatus && (
                  <Badge
                    className={getStatusBadgeClass(listing.propertyStatus)}
                  >
                    {formatEnumLabel(listing.propertyStatus)}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-custom-dark lg:text-5xl">
                {listing.title ?? 'Untitled Listing'}
              </h1>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-semibold text-custom-gray-700">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-custom-orange" />
                  {locationLabel}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4 text-custom-orange" />
                  Published{' '}
                  {formatDate(listing.publishedAt ?? listing.createdAt)}
                </span>
              </div>

              <p className="text-2xl font-extrabold text-custom-orange lg:text-4xl">
                {formatPrice(listing.pricing)}
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatChip
                  icon={<BedDouble className="size-4" />}
                  label="Bedrooms"
                  value={String(listing.details?.bedroomsCount ?? 'N/A')}
                />
                <StatChip
                  icon={<Bath className="size-4" />}
                  label="Bathrooms"
                  value={String(listing.details?.bathroomsCount ?? 'N/A')}
                />
                <StatChip
                  icon={<Maximize className="size-4" />}
                  label="Living Area"
                  value={
                    listing.details?.livingArea != null
                      ? `${formatNumber(listing.details.livingArea)} sqft`
                      : 'N/A'
                  }
                />
                <StatChip
                  icon={<Eye className="size-4" />}
                  label="Views"
                  value={formatNumber(listing.counters?.viewCount)}
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-4 shadow-custom backdrop-blur-sm">
              <img
                src={heroImage}
                alt=""
                aria-hidden="true"
                className="h-56 w-full rounded-2xl object-cover lg:h-72"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/40 bg-black/55 p-4 backdrop-blur-sm">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/75">
                  Listing Snapshot
                </p>
                <div className="mt-2 grid grid-cols-3 gap-2 text-white">
                  <div>
                    <p className="text-xl font-extrabold">
                      {formatNumber(listing.counters?.favoriteCount)}
                    </p>
                    <p className="text-xs font-semibold text-white/75">
                      Favorites
                    </p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold">
                      {formatNumber(listing.counters?.saveCount)}
                    </p>
                    <p className="text-xs font-semibold text-white/75">Saves</p>
                  </div>
                  <div>
                    <p className="text-xl font-extrabold">
                      {formatNumber(listing.media?.length)}
                    </p>
                    <p className="text-xs font-semibold text-white/75">Media</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 lg:px-30">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <ListingGallery
              key={listing.listingId ?? 'listing-gallery'}
              media={listing.media}
              title={listing.title}
            />

            <div className="rounded-2xl border border-custom-gray-300/50 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-custom-orange/10 text-custom-orange">
                  <Building2 className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.1em] text-custom-orange">
                    Overview
                  </p>
                  <h2 className="text-xl font-extrabold tracking-tight text-custom-dark">
                    Property Description
                  </h2>
                </div>
              </div>
              <p className="text-sm font-semibold leading-7 text-custom-gray-700">
                {listing.description?.trim() ||
                  'No description provided for this listing yet.'}
              </p>
            </div>

            <div className="rounded-2xl border border-custom-gray-300/50 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-custom-orange/10 text-custom-orange">
                  <Sofa className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.1em] text-custom-orange">
                    Specifications
                  </p>
                  <h2 className="text-xl font-extrabold tracking-tight text-custom-dark">
                    Property Details
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <DetailItem
                  label="Condition"
                  value={formatEnumLabel(listing.details?.listingCondition)}
                />
                <DetailItem
                  label="Facing"
                  value={formatEnumLabel(listing.details?.facingDirection)}
                />
                <DetailItem
                  label="Year Built"
                  value={
                    listing.details?.yearBuilt != null
                      ? String(listing.details.yearBuilt)
                      : 'N/A'
                  }
                />
                <DetailItem
                  label="Bedrooms"
                  value={
                    listing.details?.bedroomsCount != null
                      ? String(listing.details.bedroomsCount)
                      : 'N/A'
                  }
                />
                <DetailItem
                  label="Bathrooms"
                  value={
                    listing.details?.bathroomsCount != null
                      ? String(listing.details.bathroomsCount)
                      : 'N/A'
                  }
                />
                <DetailItem
                  label="Balconies"
                  value={
                    listing.details?.balconiesCount != null
                      ? String(listing.details.balconiesCount)
                      : 'N/A'
                  }
                />
                <DetailItem
                  label="Floor Level"
                  value={
                    listing.details?.floorLevel != null
                      ? String(listing.details.floorLevel)
                      : 'N/A'
                  }
                />
                <DetailItem
                  label="Living Area"
                  value={
                    listing.details?.livingArea != null
                      ? `${formatNumber(listing.details.livingArea)} sqft`
                      : 'N/A'
                  }
                />
                <DetailItem
                  label="Lot Area"
                  value={
                    listing.details?.lotArea != null
                      ? `${formatNumber(listing.details.lotArea)} sqft`
                      : 'N/A'
                  }
                />
                <DetailItem
                  label="Parking"
                  value={
                    listing.details?.parkingArea != null
                      ? `${listing.details.parkingArea} spot(s)`
                      : 'N/A'
                  }
                />
                <DetailItem
                  label="Furnished"
                  value={
                    isTruthyBoolean(listing.details?.furnished) ? 'Yes' : 'No'
                  }
                />
                <DetailItem
                  label="Pet Friendly"
                  value={
                    isTruthyBoolean(listing.details?.petFriendly) ? 'Yes' : 'No'
                  }
                />
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-custom-gray-300/50 bg-white p-6 shadow-sm">
              <img
                src={mapOverlay}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover opacity-[0.05]"
              />
              <div className="relative">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-custom-orange/10 text-custom-orange">
                      <MapPin className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.1em] text-custom-orange">
                        Location
                      </p>
                      <h2 className="text-xl font-extrabold tracking-tight text-custom-dark">
                        Address & Coordinates
                      </h2>
                    </div>
                  </div>
                  {mapHref && (
                    <Button
                      asChild
                      variant="outline"
                      className="border-custom-gray-300 bg-white"
                    >
                      <a href={mapHref} target="_blank" rel="noreferrer">
                        <ExternalLink className="size-4" />
                        Open in Maps
                      </a>
                    </Button>
                  )}
                </div>

                <div className="rounded-xl border border-custom-gray-300/50 bg-custom-bg-warm-2 px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-custom-gray-600">
                    Full Address
                  </p>
                  <p className="mt-1 text-sm font-bold leading-6 text-custom-dark">
                    {fullAddress}
                  </p>
                </div>

                {listing.location && (
                  <div className="mt-4">
                    <LocationViewer location={listing.location} />
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <DetailItem
                    label="Area"
                    value={listing.location?.area ?? 'N/A'}
                  />
                  <DetailItem
                    label="District"
                    value={listing.location?.district ?? 'N/A'}
                  />
                  <DetailItem
                    label="Latitude"
                    value={
                      listing.location?.latitude != null
                        ? String(listing.location.latitude)
                        : 'N/A'
                    }
                  />
                  <DetailItem
                    label="Longitude"
                    value={
                      listing.location?.longitude != null
                        ? String(listing.location.longitude)
                        : 'N/A'
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-custom-gray-300/50 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-custom-orange">
                Quick Actions
              </p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-custom-dark">
                Listing Summary
              </h2>

              <div className="mt-4 rounded-xl border border-custom-orange/20 bg-custom-orange/5 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.1em] text-custom-gray-600">
                  Asking Price
                </p>
                <p className="mt-1 text-2xl font-extrabold text-custom-orange">
                  {formatPrice(listing.pricing)}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <Button
                  asChild
                  className="w-full bg-custom-dark text-white hover:bg-custom-dark/90"
                >
                  <Link to="/listing">
                    <ArrowLeft className="size-4" />
                    Back to Listings
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-custom-gray-300 bg-white"
                >
                  <Link to="/listing/create">
                    <Plus className="size-4" />
                    Create New Listing
                  </Link>
                </Button>
              </div>

              <Separator className="my-5 bg-custom-gray-300/60" />

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-semibold text-custom-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <Eye className="size-4 text-custom-orange" />
                    Views
                  </span>
                  <span className="font-extrabold text-custom-dark">
                    {formatNumber(listing.counters?.viewCount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-custom-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <Heart className="size-4 text-custom-orange" />
                    Favorites
                  </span>
                  <span className="font-extrabold text-custom-dark">
                    {formatNumber(listing.counters?.favoriteCount)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-custom-gray-700">
                  <span className="inline-flex items-center gap-2">
                    <Bookmark className="size-4 text-custom-orange" />
                    Saves
                  </span>
                  <span className="font-extrabold text-custom-dark">
                    {formatNumber(listing.counters?.saveCount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-custom-gray-300/50 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold uppercase tracking-[0.12em] text-custom-orange">
                Listed By
              </p>
              <div className="mt-4 flex items-center gap-3">
                <Avatar
                  size="lg"
                  className="size-14 border border-custom-gray-300/60"
                >
                  <AvatarImage
                    src={listing.owner?.profilePictureUrl}
                    alt={listing.owner?.name ?? 'Owner'}
                  />
                  <AvatarFallback className="bg-custom-orange/10 font-bold text-custom-orange">
                    {OwnerInitials(listing.owner?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-base font-extrabold text-custom-dark">
                    {listing.owner?.name ?? 'UrbanNest User'}
                  </p>
                  <p className="text-sm font-semibold text-custom-gray-700">
                    Verified listing owner
                  </p>
                </div>
              </div>

              <Separator className="my-5 bg-custom-gray-300/60" />

              <div className="space-y-3 text-sm font-semibold text-custom-gray-700">
                <div className="flex items-center gap-2">
                  <UserRound className="size-4 text-custom-orange" />
                  <span className="truncate">
                    Owner ID: {listing.owner?.userId ?? 'Not available'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-custom-orange" />
                  <span>Created on {formatDate(listing.createdAt)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Compass className="size-4 text-custom-orange" />
                  <span>Status: {formatEnumLabel(listing.propertyStatus)}</span>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-custom-gray-300/50 bg-white p-6 shadow-sm">
              <img
                src={mapOverlay}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover opacity-[0.035]"
              />
              <div className="relative">
                <p className="text-sm font-bold uppercase tracking-[0.12em] text-custom-orange">
                  At a Glance
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <DetailItem
                    label="Type"
                    value={formatEnumLabel(listing.propertyType)}
                  />
                  <DetailItem
                    label="Condition"
                    value={formatEnumLabel(listing.details?.listingCondition)}
                  />
                  <DetailItem
                    label="Furnished"
                    value={
                      isTruthyBoolean(listing.details?.furnished) ? 'Yes' : 'No'
                    }
                  />
                  <DetailItem
                    label="Pet Friendly"
                    value={
                      isTruthyBoolean(listing.details?.petFriendly)
                        ? 'Yes'
                        : 'No'
                    }
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
