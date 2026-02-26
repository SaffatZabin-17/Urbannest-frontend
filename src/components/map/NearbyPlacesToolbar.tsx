import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PLACE_CATEGORIES, type PlaceCategoryId } from './constants';

type NearbyPlacesToolbarProps = {
  activeCategories: Set<PlaceCategoryId>;
  loading: Set<PlaceCategoryId>;
  showOverlay: boolean;
  onToggleCategory: (id: PlaceCategoryId) => void;
  onToggleOverlay: () => void;
};

export function NearbyPlacesToolbar({
  activeCategories,
  loading,
  showOverlay,
  onToggleCategory,
  onToggleOverlay,
}: NearbyPlacesToolbarProps) {
  const hasActive = activeCategories.size > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.1em] text-custom-gray-600">
          Nearby Places
        </p>
        {hasActive && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleOverlay}
            className="h-7 gap-1.5 border-custom-gray-300 bg-white px-2.5 text-xs"
          >
            {showOverlay ? (
              <>
                <EyeOff className="size-3" />
                Hide
              </>
            ) : (
              <>
                <Eye className="size-3" />
                Show
              </>
            )}
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {PLACE_CATEGORIES.map((category) => {
          const isActive = activeCategories.has(category.id);
          const isLoading = loading.has(category.id);

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onToggleCategory(category.id)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors',
                isActive
                  ? 'border-transparent text-white'
                  : 'border-custom-gray-300 bg-white text-custom-gray-700 hover:bg-custom-bg-warm-2'
              )}
              style={isActive ? { backgroundColor: category.color } : undefined}
            >
              {isLoading ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
              )}
              {category.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
