import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ListingCard from '@/components/listing/ListingCard';
import { fetchListings } from '@/api/listings';
import type { ListingResponse } from '@/api/model';
import { GetListingsPropertyType } from '@/api/model';

import searchBg from '@/assets/logos/img_search_page_image.jpg';

/* ─── Constants ─── */

const PAGE_SIZE = 9;

const PROPERTY_TYPES = Object.values(GetListingsPropertyType);

/* ─── Component ─── */

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter state — initialized from URL params
  const [propertyType, setPropertyType] = useState(
    searchParams.get('propertyType') ?? ''
  );
  const [district, setDistrict] = useState(searchParams.get('district') ?? '');
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') ?? '');
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') ?? '');
  const [minBedrooms, setMinBedrooms] = useState(
    searchParams.get('minBedrooms') ?? ''
  );
  const [page, setPage] = useState(Number(searchParams.get('page') ?? '0'));

  // Results state
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  /* ─── Fetch ─── */

  const doSearch = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchListings({
        ...(propertyType
          ? {
              propertyType:
                propertyType as (typeof GetListingsPropertyType)[keyof typeof GetListingsPropertyType],
            }
          : {}),
        ...(district ? { district } : {}),
        ...(priceMin ? { priceMin: Number(priceMin) } : {}),
        ...(priceMax ? { priceMax: Number(priceMax) } : {}),
        ...(minBedrooms ? { minBedrooms: Number(minBedrooms) } : {}),
        pageable: { page, size: PAGE_SIZE, sort: ['publishedAt,desc'] },
      });
      setListings(res.data.content ?? []);
      setTotalPages(res.data.totalPages ?? 0);
      setTotalElements(res.data.totalElements ?? 0);
    } catch {
      setError('Failed to load listings. Please try again.');
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [propertyType, district, priceMin, priceMax, minBedrooms, page]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  /* ─── Sync filters to URL ─── */

  useEffect(() => {
    const params = new URLSearchParams();
    if (propertyType) params.set('propertyType', propertyType);
    if (district) params.set('district', district);
    if (priceMin) params.set('priceMin', priceMin);
    if (priceMax) params.set('priceMax', priceMax);
    if (minBedrooms) params.set('minBedrooms', minBedrooms);
    if (page > 0) params.set('page', String(page));
    setSearchParams(params, { replace: true });
  }, [
    propertyType,
    district,
    priceMin,
    priceMax,
    minBedrooms,
    page,
    setSearchParams,
  ]);

  /* ─── Handlers ─── */

  function handleSearch() {
    setPage(0);
  }

  function clearFilters() {
    setPropertyType('');
    setDistrict('');
    setPriceMin('');
    setPriceMax('');
    setMinBedrooms('');
    setPage(0);
  }

  const hasFilters = !!(
    propertyType ||
    district ||
    priceMin ||
    priceMax ||
    minBedrooms
  );

  /* ─── Filter Controls (shared between desktop & mobile) ─── */

  function FilterControls({ onDone }: { onDone?: () => void }) {
    return (
      <div className="flex flex-col lg:flex-row items-stretch lg:items-end gap-4">
        {/* Property Type */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <label className="text-sm font-semibold text-custom-dark">
            Property Type
          </label>
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger className="w-full h-11 rounded-lg border-custom-gray-300">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* District */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <label className="text-sm font-semibold text-custom-dark">
            District
          </label>
          <Input
            placeholder="e.g. Dhaka"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="h-11 rounded-lg border-custom-gray-300"
          />
        </div>

        {/* Price Min */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <label className="text-sm font-semibold text-custom-dark">
            Min Price
          </label>
          <Input
            type="number"
            placeholder="0"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="h-11 rounded-lg border-custom-gray-300"
          />
        </div>

        {/* Price Max */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <label className="text-sm font-semibold text-custom-dark">
            Max Price
          </label>
          <Input
            type="number"
            placeholder="Any"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="h-11 rounded-lg border-custom-gray-300"
          />
        </div>

        {/* Bedrooms */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <label className="text-sm font-semibold text-custom-dark">
            Bedrooms
          </label>
          <Select value={minBedrooms} onValueChange={setMinBedrooms}>
            <SelectTrigger className="w-full h-11 rounded-lg border-custom-gray-300">
              <SelectValue placeholder="Any" />
            </SelectTrigger>
            <SelectContent>
              {['1', '2', '3', '4', '5'].map((n) => (
                <SelectItem key={n} value={n}>
                  {n}+ Beds
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 lg:pb-0">
          <Button
            onClick={() => {
              handleSearch();
              onDone?.();
            }}
            className="bg-custom-orange hover:bg-custom-orange-deep text-white font-semibold rounded-lg h-11 px-6 cursor-pointer flex-1 lg:flex-none"
          >
            <Search className="size-4" />
            Search
          </Button>
          {hasFilters && (
            <Button
              variant="outline"
              onClick={() => {
                clearFilters();
                onDone?.();
              }}
              className="rounded-lg h-11 px-4 cursor-pointer"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  /* ─── Pagination ─── */

  function PaginationControls() {
    if (totalPages <= 1) return null;

    const pages: (number | 'ellipsis')[] = [];
    for (let i = 0; i < totalPages; i++) {
      if (i === 0 || i === totalPages - 1 || (i >= page - 1 && i <= page + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== 'ellipsis') {
        pages.push('ellipsis');
      }
    }

    return (
      <div className="flex items-center justify-center gap-2 pt-8">
        <Button
          variant="outline"
          size="icon"
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="rounded-lg cursor-pointer"
        >
          <ChevronLeft className="size-4" />
        </Button>

        {pages.map((p, idx) =>
          p === 'ellipsis' ? (
            <span
              key={`ellipsis-${idx}`}
              className="w-10 text-center text-custom-gray-600"
            >
              ...
            </span>
          ) : (
            <Button
              key={p}
              variant={p === page ? 'default' : 'outline'}
              size="icon"
              onClick={() => setPage(p)}
              className={`rounded-lg cursor-pointer ${
                p === page
                  ? 'bg-custom-orange hover:bg-custom-orange-deep text-white border-custom-orange'
                  : ''
              }`}
            >
              {p + 1}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="icon"
          disabled={page >= totalPages - 1}
          onClick={() => setPage(page + 1)}
          className="rounded-lg cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    );
  }

  /* ─── Render ─── */

  return (
    <div className="flex flex-col">
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden">
        <img
          src={searchBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-custom-dark/70" />
        <div className="relative px-5 lg:px-30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl text-center space-y-4">
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-[140%]">
              Find Your Dream Property
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-[180%]">
              Search through thousands of listings to find the perfect home that
              matches your lifestyle and budget.
            </p>
          </div>
        </div>
      </section>

      {/* ── Desktop Filters ── */}
      <section className="hidden lg:block bg-white border-b border-custom-gray-300/50 px-5 lg:px-30 py-6">
        <div className="mx-auto max-w-7xl">
          <FilterControls />
        </div>
      </section>

      {/* ── Mobile Filter Toggle ── */}
      <div className="lg:hidden bg-white border-b border-custom-gray-300/50 px-5 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <p className="text-sm font-semibold text-custom-dark">
            {totalElements} {totalElements === 1 ? 'property' : 'properties'}{' '}
            found
          </p>
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="rounded-lg h-10 cursor-pointer"
          >
            <SlidersHorizontal className="size-4" />
            Filters
            {hasFilters && (
              <span className="ml-1 bg-custom-orange text-white text-xs rounded-full size-5 inline-flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </div>
        {showMobileFilters && (
          <div className="mt-4 mx-auto max-w-7xl">
            <FilterControls onDone={() => setShowMobileFilters(false)} />
          </div>
        )}
      </div>

      {/* ── Results ── */}
      <section className="bg-custom-bg-warm-1 px-5 lg:px-30 py-12 lg:py-16 min-h-[60vh]">
        <div className="mx-auto max-w-7xl">
          {/* Results header (desktop) */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <p className="text-lg font-semibold text-custom-dark">
              {loading
                ? 'Searching...'
                : `${totalElements} ${totalElements === 1 ? 'property' : 'properties'} found`}
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="size-10 text-custom-orange animate-spin" />
              <p className="text-custom-gray-600 font-medium">
                Searching properties...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <p className="text-red-500 font-medium">{error}</p>
              <Button
                onClick={doSearch}
                className="bg-custom-orange hover:bg-custom-orange-deep text-white font-semibold rounded-lg cursor-pointer"
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Empty */}
          {!loading && !error && listings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="flex items-center justify-center size-20 rounded-full bg-custom-orange-bg">
                <Building2 className="size-10 text-custom-orange" />
              </div>
              <h3 className="text-xl font-bold text-custom-dark">
                No properties found
              </h3>
              <p className="text-custom-gray-600 text-center max-w-md">
                Try adjusting your filters or search in a different area to find
                more properties.
              </p>
              {hasFilters && (
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="rounded-lg cursor-pointer"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          )}

          {/* Results Grid */}
          {!loading && !error && listings.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.listingId} listing={listing} />
                ))}
              </div>
              <PaginationControls />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
