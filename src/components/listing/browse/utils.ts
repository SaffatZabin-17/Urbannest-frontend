import type { GetListingsParams } from '@/api/model';
import type { ListingBrowseFilters, PageItem } from './types';

export function parsePositiveNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function parseNonNegativeNumber(value: string) {
  if (!value.trim()) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

export function parsePositiveInt(value: string, fallback: number) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export function buildRequestParams(
  filters: ListingBrowseFilters
): GetListingsParams {
  const params: GetListingsParams = {
    pageable: {
      page: Math.max(0, filters.page - 1),
      size: parsePositiveInt(filters.pageSize, 9),
      sort: [filters.sort],
    },
  };

  if (filters.propertyType !== 'all')
    params.propertyType = filters.propertyType;

  const district = filters.district.trim();
  if (district) params.district = district;

  const minBedrooms = parsePositiveNumber(filters.minBedrooms);
  if (minBedrooms !== undefined) params.minBedrooms = minBedrooms;

  const priceMin = parseNonNegativeNumber(filters.priceMin);
  if (priceMin !== undefined) params.priceMin = priceMin;

  const priceMax = parseNonNegativeNumber(filters.priceMax);
  if (priceMax !== undefined) params.priceMax = priceMax;

  return params;
}

export function getPaginationItems(
  currentPage: number,
  totalPages: number
): PageItem[] {
  if (totalPages <= 1) return [1];
  if (totalPages <= 7)
    return Array.from({ length: totalPages }, (_, i) => i + 1);

  const items: PageItem[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) items.push('left-ellipsis');
  for (let page = start; page <= end; page += 1) items.push(page);
  if (end < totalPages - 1) items.push('right-ellipsis');

  items.push(totalPages);
  return items;
}
