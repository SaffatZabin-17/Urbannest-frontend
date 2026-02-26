import { useEffect, useMemo, useState } from 'react';
import { fetchListings } from '@/api/listings';
import { DEFAULT_FILTERS } from './constants';
import type {
  FetchState,
  ListingBrowseFilters,
  PageItem,
  PropertyTypeFilter,
  SortOption,
} from './types';
import { buildRequestParams, getPaginationItems } from './utils';

export function useListingBrowseController() {
  const [draftFilters, setDraftFilters] =
    useState<ListingBrowseFilters>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] =
    useState<ListingBrowseFilters>(DEFAULT_FILTERS);
  const [fetchState, setFetchState] = useState<FetchState>({
    status: 'idle',
    queryKey: '',
    results: null,
    error: null,
  });

  const queryKey = useMemo(
    () => JSON.stringify(appliedFilters),
    [appliedFilters]
  );

  useEffect(() => {
    let ignore = false;

    fetchListings(buildRequestParams(appliedFilters))
      .then((response) => {
        if (ignore) return;
        setFetchState({
          status: 'success',
          queryKey,
          results: response.data,
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (ignore) return;
        if (error instanceof DOMException && error.name === 'AbortError')
          return;

        setFetchState({
          status: 'error',
          queryKey,
          results: null,
          error:
            error instanceof Error ? error.message : 'Failed to load listings.',
        });
      });

    return () => {
      ignore = true;
    };
  }, [appliedFilters, queryKey]);

  const loading =
    fetchState.status === 'idle' || fetchState.queryKey !== queryKey;
  const results = fetchState.queryKey === queryKey ? fetchState.results : null;
  const error = fetchState.queryKey === queryKey ? fetchState.error : null;

  const currentPage = (results?.number ?? appliedFilters.page - 1) + 1;
  const totalPages = results?.totalPages ?? 0;
  const totalElements = results?.totalElements ?? 0;
  const listings = results?.content ?? [];

  const applyFilters = () => {
    setAppliedFilters((prev) => ({
      ...draftFilters,
      page: 1,
      pageSize: draftFilters.pageSize || prev.pageSize,
    }));
  };

  const resetFilters = () => {
    setDraftFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
  };

  const setPage = (page: number) => {
    setAppliedFilters((prev) => ({ ...prev, page: Math.max(1, page) }));
  };

  const setDraftFilter = <K extends keyof ListingBrowseFilters>(
    key: K,
    value: ListingBrowseFilters[K]
  ) => {
    setDraftFilters((prev) => ({ ...prev, [key]: value }));
  };

  const paginationItems: PageItem[] = getPaginationItems(
    Math.max(1, currentPage),
    Math.max(1, totalPages || 1)
  );

  return {
    draftFilters,
    appliedFilters,
    loading,
    error,
    currentPage,
    totalPages,
    totalElements,
    listings,
    paginationItems,
    setDraftFilter,
    applyFilters,
    resetFilters,
    setPage,
  };
}

export type ListingBrowseController = ReturnType<
  typeof useListingBrowseController
>;

export type SetDraftFilter = ListingBrowseController['setDraftFilter'];
export type { PropertyTypeFilter, SortOption };
