import { RefreshCcw, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatLabel } from '@/components/listing/utils';
import { PROPERTY_TYPES, SORT_OPTIONS } from './constants';
import type {
  ListingBrowseFilters,
  PropertyTypeFilter,
  SortOption,
} from './types';

type BrowseFiltersProps = {
  draftFilters: ListingBrowseFilters;
  onFilterChange: <K extends keyof ListingBrowseFilters>(
    key: K,
    value: ListingBrowseFilters[K]
  ) => void;
  onApply: () => void;
  onReset: () => void;
};

export function BrowseFilters({
  draftFilters,
  onFilterChange,
  onApply,
  onReset,
}: BrowseFiltersProps) {
  return (
    <div className="rounded-2xl border border-custom-gray-300/50 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-full bg-custom-orange/12 text-custom-orange">
          <SlidersHorizontal className="size-4" />
        </div>
        <div>
          <p className="text-lg font-extrabold tracking-tight text-custom-dark">
            Browse Filters
          </p>
          <p className="text-xs font-semibold text-custom-gray-700">
            Apply quick filters and sorting to refine results
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
        <div className="space-y-2 xl:col-span-2">
          <label className="text-sm font-semibold text-custom-dark">
            District
          </label>
          <Input
            value={draftFilters.district}
            onChange={(e) => onFilterChange('district', e.target.value)}
            placeholder="Dhaka"
            className="h-10 border-custom-gray-300 bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-custom-dark">Type</label>
          <Select
            value={draftFilters.propertyType}
            onValueChange={(value) =>
              onFilterChange('propertyType', value as PropertyTypeFilter)
            }
          >
            <SelectTrigger className="h-10 w-full border-custom-gray-300 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {formatLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-custom-dark">
            Min Beds
          </label>
          <Input
            type="number"
            min="1"
            step="1"
            value={draftFilters.minBedrooms}
            onChange={(e) => onFilterChange('minBedrooms', e.target.value)}
            placeholder="2"
            className="h-10 border-custom-gray-300 bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-custom-dark">
            Min Price
          </label>
          <Input
            type="number"
            min="0"
            step="1"
            value={draftFilters.priceMin}
            onChange={(e) => onFilterChange('priceMin', e.target.value)}
            placeholder="1000000"
            className="h-10 border-custom-gray-300 bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-custom-dark">
            Max Price
          </label>
          <Input
            type="number"
            min="0"
            step="1"
            value={draftFilters.priceMax}
            onChange={(e) => onFilterChange('priceMax', e.target.value)}
            placeholder="8000000"
            className="h-10 border-custom-gray-300 bg-white"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_220px_160px]">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-custom-dark">
            Sort By
          </label>
          <Select
            value={draftFilters.sort}
            onValueChange={(value) =>
              onFilterChange('sort', value as SortOption)
            }
          >
            <SelectTrigger className="h-10 w-full border-custom-gray-300 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-custom-dark">
            Page Size
          </label>
          <Select
            value={draftFilters.pageSize}
            onValueChange={(value) => onFilterChange('pageSize', value)}
          >
            <SelectTrigger className="h-10 w-full border-custom-gray-300 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 / page</SelectItem>
              <SelectItem value="9">9 / page</SelectItem>
              <SelectItem value="12">12 / page</SelectItem>
              <SelectItem value="18">18 / page</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button
            type="button"
            className="h-10 flex-1 bg-custom-dark text-white hover:bg-custom-dark/90"
            onClick={onApply}
          >
            <Search className="size-4" />
            Apply
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-10 border-custom-gray-300 bg-white"
            onClick={onReset}
          >
            <RefreshCcw className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
