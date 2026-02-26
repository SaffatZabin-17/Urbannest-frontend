import type { GetListingsParams, PageListingResponse } from '@/api/model';

export type PropertyTypeFilter =
  | NonNullable<GetListingsParams['propertyType']>
  | 'all';

export type SortOption =
  | 'publishedAt,desc'
  | 'createdAt,desc'
  | 'pricing,asc'
  | 'pricing,desc';

export type ListingBrowseFilters = {
  district: string;
  propertyType: PropertyTypeFilter;
  minBedrooms: string;
  priceMin: string;
  priceMax: string;
  pageSize: string;
  sort: SortOption;
  page: number;
};

export type FetchState = {
  status: 'idle' | 'success' | 'error';
  queryKey: string;
  results: PageListingResponse | null;
  error: string | null;
};

export type PageItem = number | 'left-ellipsis' | 'right-ellipsis';
