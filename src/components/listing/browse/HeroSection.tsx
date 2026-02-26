import { Link } from 'react-router-dom';
import { Building2, Plus, Search } from 'lucide-react';
import heroBg from '@/assets/logos/img_search_page_image.jpg';
import heroImage from '@/assets/logos/img_coverimage.png';
import mapOverlay from '@/assets/logos/img_map.png';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type HeroSectionProps = {
  loading: boolean;
  totalElements: number;
  totalPages: number;
  pageSize: string;
};

export function HeroSection({
  loading,
  totalElements,
  totalPages,
  pageSize,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden px-5 py-10 lg:px-30 lg:py-14">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.18]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-custom-bg-warm-1 via-custom-bg-warm-1/95 to-custom-bg-warm-1/85" />
      </div>
      <img
        src={mapOverlay}
        alt=""
        aria-hidden="true"
        className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-[0.06]"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-5">
          <Badge className="border border-custom-orange/20 bg-custom-orange/10 px-3 py-1 text-custom-orange">
            <Building2 className="mr-1 size-3.5" />
            Property Listings
          </Badge>
          <h1 className="text-4xl font-extrabold leading-[125%] tracking-tight text-custom-dark lg:text-5xl">
            Browse verified homes and spaces across the city
          </h1>
          <p className="max-w-2xl text-base font-semibold leading-7 text-custom-gray-700 lg:text-lg">
            Discover published listings with structured filters, pricing
            options, and clean cards designed for quick comparison.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              asChild
              className="bg-custom-dark text-white hover:bg-custom-dark/90"
            >
              <Link to="/listing/create">
                <Plus className="size-4" />
                Create Listing
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-custom-gray-300 bg-white"
            >
              <Link to="/search">
                <Search className="size-4" />
                Advanced Search
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-white/70 bg-white/85 p-4 shadow-custom backdrop-blur-sm">
          <img
            src={heroImage}
            alt="Featured listings"
            className="h-72 w-full rounded-2xl object-cover lg:h-80"
          />
          <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/40 bg-black/45 p-4 backdrop-blur-sm">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-white/80">
              Market Snapshot
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-white">
              <div>
                <p className="text-2xl font-extrabold">
                  {loading ? '...' : totalElements}
                </p>
                <p className="text-xs font-semibold text-white/80">Listings</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold">
                  {loading ? '...' : totalPages || 0}
                </p>
                <p className="text-xs font-semibold text-white/80">Pages</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold">{pageSize}</p>
                <p className="text-xs font-semibold text-white/80">Page Size</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
