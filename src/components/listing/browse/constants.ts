import { GetListingsPropertyType } from '@/api/model';
import type { ListingBrowseFilters, SortOption } from './types';

export const PROPERTY_TYPES = Object.values(GetListingsPropertyType);

export const SORT_OPTIONS: Array<{ value: SortOption; label: string }> = [
  { value: 'publishedAt,desc', label: 'Latest Published' },
  { value: 'createdAt,desc', label: 'Newest Created' },
  { value: 'pricing,asc', label: 'Price: Low to High' },
  { value: 'pricing,desc', label: 'Price: High to Low' },
];

export const DEFAULT_FILTERS: ListingBrowseFilters = {
  district: '',
  propertyType: 'all',
  minBedrooms: '',
  priceMin: '',
  priceMax: '',
  pageSize: '9',
  sort: 'publishedAt,desc',
  page: 1,
};
