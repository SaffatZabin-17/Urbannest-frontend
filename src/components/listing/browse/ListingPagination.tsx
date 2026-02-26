import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { PageItem } from './types';

type ListingPaginationProps = {
  currentPage: number;
  totalPages: number;
  paginationItems: PageItem[];
  onPageChange: (page: number) => void;
};

export function ListingPagination({
  currentPage,
  totalPages,
  paginationItems,
  onPageChange,
}: ListingPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="rounded-2xl border border-custom-gray-300/50 bg-white p-4 shadow-sm">
      <Pagination>
        <PaginationContent className="flex-wrap justify-center">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={currentPage <= 1}
              className={
                currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined
              }
              onClick={(event) => {
                event.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
            />
          </PaginationItem>

          {paginationItems.map((item) => {
            if (item === 'left-ellipsis' || item === 'right-ellipsis') {
              return (
                <PaginationItem key={item}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            return (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  isActive={item === currentPage}
                  className={
                    item === currentPage
                      ? 'border-custom-orange/30 bg-custom-orange/10 text-custom-orange hover:bg-custom-orange/15'
                      : undefined
                  }
                  onClick={(event) => {
                    event.preventDefault();
                    if (item !== currentPage) onPageChange(item);
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={currentPage >= totalPages}
              className={
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : undefined
              }
              onClick={(event) => {
                event.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
