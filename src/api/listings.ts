import { customFetch } from './custom-fetch';
import type { GetListingsParams } from './model';
import type { getListingsResponse } from './generated';

/**
 * Wrapper around the generated getListings that properly serializes
 * the nested `pageable` object into flat query params (page, size, sort).
 *
 * The orval-generated function calls `.toString()` on the pageable object,
 * which produces `pageable=[object Object]`. Spring Boot expects flat
 * params: `?page=0&size=10&sort=pricing,desc`.
 */
export function fetchListings(
  params: GetListingsParams
): Promise<getListingsResponse> {
  const sp = new URLSearchParams();

  if (params.propertyType) sp.set('propertyType', params.propertyType);
  if (params.priceMin !== undefined)
    sp.set('priceMin', String(params.priceMin));
  if (params.priceMax !== undefined)
    sp.set('priceMax', String(params.priceMax));
  if (params.district) sp.set('district', params.district);
  if (params.minBedrooms !== undefined)
    sp.set('minBedrooms', String(params.minBedrooms));

  // Flatten pageable into top-level params
  if (params.pageable.page !== undefined)
    sp.set('page', String(params.pageable.page));
  if (params.pageable.size !== undefined)
    sp.set('size', String(params.pageable.size));
  if (params.pageable.sort) {
    params.pageable.sort.forEach((s) => sp.append('sort', s));
  }

  const qs = sp.toString();
  return customFetch<getListingsResponse>(
    qs ? `/listings?${qs}` : '/listings',
    { method: 'GET' }
  );
}
