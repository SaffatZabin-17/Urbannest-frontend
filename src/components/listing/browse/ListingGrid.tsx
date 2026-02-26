import { AlertCircle, RefreshCcw, Search } from 'lucide-react';
import mapOverlay from '@/assets/logos/img_map.png';
import type { ListingResponse } from '@/api/model';
import ListingCard from '@/components/listing/ListingCard';
import { Button } from '@/components/ui/button';

type ListingGridProps = {
  loading: boolean;
  error: string | null;
  listings: ListingResponse[];
  onReset: () => void;
};

export function ListingGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-2xl border border-custom-gray-300/50 bg-white shadow-sm"
        >
          <div className="h-56 animate-pulse bg-custom-bg-warm-3" />
          <div className="space-y-3 p-5">
            <div className="h-4 w-24 animate-pulse rounded bg-custom-bg-warm-3" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-custom-bg-warm-3" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-custom-bg-warm-3" />
            <div className="h-8 w-1/2 animate-pulse rounded bg-custom-bg-warm-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-custom-gray-300/50 bg-white p-8 shadow-sm">
      <img
        src={mapOverlay}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.04]"
      />
      <div className="relative mx-auto max-w-xl text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-custom-orange/12">
          <Search className="size-6 text-custom-orange" />
        </div>
        <h3 className="text-2xl font-extrabold tracking-tight text-custom-dark">
          No listings found
        </h3>
        <p className="mt-3 text-base font-semibold leading-7 text-custom-gray-700">
          Try broadening your filters or reset the current selection to view
          more published listings.
        </p>
        <Button
          type="button"
          onClick={onReset}
          className="mt-5 bg-custom-dark text-white hover:bg-custom-dark/90"
        >
          <RefreshCcw className="size-4" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}

export function ListingGrid({
  loading,
  error,
  listings,
  onReset,
}: ListingGridProps) {
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
        <div className="flex items-center gap-2">
          <AlertCircle className="size-4" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (loading) return <ListingGridSkeleton />;

  if (listings.length === 0) return <EmptyState onReset={onReset} />;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing, index) => (
        <ListingCard
          key={listing.listingId ?? `${listing.title ?? 'listing'}-${index}`}
          listing={listing}
        />
      ))}
    </div>
  );
}
