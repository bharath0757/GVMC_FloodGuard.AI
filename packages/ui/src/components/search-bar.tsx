import * as React from 'react';
import { cn } from '@floodguard/utils';
import { Search, X } from 'lucide-react';
import { Spinner } from './spinner';

/**
 * Storybook & Component Documentation: SearchBar
 * 
 * **Purpose:** Search input bar for locations, shelters, wards, or reports with quick clear & shortcut badge.
 * **Usage:** `<SearchBar value={query} onChange={(e) => setQuery(e.target.value)} onClear={() => setQuery('')} isLoading={isSearching} />`
 * **Accessibility Notes:** 
 * - Includes `type="search"`, `aria-label="Search"`.
 * - Provides keyboard shortcut visual badge (`⌘K`).
 */

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  isLoading?: boolean;
  shortcutHint?: string;
}

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, value, onChange, onClear, isLoading = false, shortcutHint = '⌘K', disabled, ...props }, ref) => {
    const hasValue = Boolean(value);

    return (
      <div className={cn('relative w-full flex items-center', className)}>
        <div className="absolute left-3 text-muted-foreground pointer-events-none">
          {isLoading ? <Spinner size="sm" /> : <Search className="h-4 w-4" />}
        </div>
        <input
          type="search"
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder="Search locations, shelters, wards..."
          className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-16 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all"
          {...props}
        />
        <div className="absolute right-3 flex items-center space-x-1">
          {hasValue && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="p-1 text-muted-foreground hover:text-foreground rounded-full transition-colors"
              aria-label="Clear search query"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {!hasValue && shortcutHint && (
            <kbd className="hidden sm:inline-flex h-5 items-center rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              {shortcutHint}
            </kbd>
          )}
        </div>
      </div>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export { SearchBar };
