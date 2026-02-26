import { BrowseFilters } from '@/components/listing/browse/BrowseFilters';
import { HeroSection } from '@/components/listing/browse/HeroSection';
import { ListingGrid } from '@/components/listing/browse/ListingGrid';
import { ListingPagination } from '@/components/listing/browse/ListingPagination';
import { ResultsHeader } from '@/components/listing/browse/ResultsHeader';
import { useListingBrowseController } from '@/components/listing/browse/useListingBrowseController';

export default function ListingsPage() {
  const {
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
  } = useListingBrowseController();

  return (
    <div className="flex flex-col bg-custom-bg-warm-1">
      <HeroSection
        loading={loading}
        totalElements={totalElements}
        totalPages={totalPages}
        pageSize={draftFilters.pageSize}
      />

      <section className="px-5 pb-16 lg:px-30">
        <div className="mx-auto max-w-7xl space-y-6">
          <BrowseFilters
            draftFilters={draftFilters}
            onFilterChange={setDraftFilter}
            onApply={applyFilters}
            onReset={resetFilters}
          />

          <ResultsHeader
            loading={loading}
            totalElements={totalElements}
            currentPage={currentPage}
            totalPages={totalPages}
            appliedFilters={appliedFilters}
          />

          <ListingGrid
            loading={loading}
            error={error}
            listings={listings}
            onReset={resetFilters}
          />

          <ListingPagination
            currentPage={currentPage}
            totalPages={totalPages}
            paginationItems={paginationItems}
            onPageChange={setPage}
          />
        </div>
      </section>
    </div>
  );
}
