import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatLabel } from '@/components/listing/utils';
import type { ListingBrowseFilters } from './types';

type ResultsHeaderProps = {
  loading: boolean;
  totalElements: number;
  currentPage: number;
  totalPages: number;
  appliedFilters: ListingBrowseFilters;
};

export function ResultsHeader({
  loading,
  totalElements,
  currentPage,
  totalPages,
  appliedFilters,
}: ResultsHeaderProps) {
  return (
    <div className="rounded-2xl border border-custom-gray-300/50 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-custom-orange">
            Listing Results
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-custom-dark">
            {loading
              ? 'Loading listings...'
              : `${totalElements} listing${totalElements === 1 ? '' : 's'} available`}
          </h2>
          <p className="mt-1 text-sm font-semibold text-custom-gray-700">
            Page {Math.max(1, currentPage)}
            {totalPages > 0 ? ` of ${totalPages}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {appliedFilters.propertyType !== 'all' && (
            <Badge className="border border-custom-orange/20 bg-custom-orange/10 text-custom-orange">
              {formatLabel(appliedFilters.propertyType)}
            </Badge>
          )}
          {appliedFilters.district.trim() && (
            <Badge className="border border-custom-gray-300/50 bg-custom-bg-warm-3 text-custom-dark">
              <MapPin className="mr-1 size-3.5 text-custom-orange" />
              {appliedFilters.district.trim()}
            </Badge>
          )}
          {appliedFilters.minBedrooms && (
            <Badge className="border border-custom-gray-300/50 bg-custom-bg-warm-3 text-custom-dark">
              {appliedFilters.minBedrooms}+ Beds
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
