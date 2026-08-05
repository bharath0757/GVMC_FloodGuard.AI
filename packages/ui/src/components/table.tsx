import * as React from 'react';
import { cn } from '@floodguard/utils';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

/**
 * Storybook & Component Documentation: Data Table Components
 *
 * **Purpose:** Display tabular data such as shelter listings, ward risk rankings, and historical sensor telemetry.
 * **Usage:** `<Table><TableHeader><TableRow><TableHead>Ward</TableHead>...</TableRow></TableHeader><TableBody>...</TableBody></Table>`
 * **Accessibility Notes:** Semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>` with ARIA sort states.
 */

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="border-border relative w-full overflow-auto rounded-lg border">
    <table
      ref={ref}
      className={cn('w-full caption-bottom text-left text-sm', className)}
      {...props}
    />
  </div>
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn(
      'bg-muted/40 text-muted-foreground font-medium [&_tr]:border-b',
      className,
    )}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn('[&_tr:last-child]:border-0', className)}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      'bg-muted/50 [&>tr]:last-child:border-b-0 border-t font-medium',
      className,
    )}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      'border-border/60 hover:bg-muted/30 data-[state=selected]:bg-muted border-b transition-colors',
      className,
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'text-muted-foreground h-11 px-4 text-left align-middle font-medium [&:has([role=checkbox])]:pr-0',
      className,
    )}
    {...props}
  />
));
TableHead.displayName = 'TableHead';

export interface SortableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortDirection?: 'asc' | 'desc' | false;
  onSort?: () => void;
}

const SortableHead: React.FC<SortableHeadProps> = ({
  children,
  sortDirection,
  onSort,
  className,
  ...props
}) => (
  <TableHead
    className={cn(
      'hover:text-foreground cursor-pointer select-none',
      className,
    )}
    onClick={onSort}
    {...props}
  >
    <div className="flex items-center space-x-1">
      <span>{children}</span>
      {sortDirection === 'asc' && (
        <ChevronUp className="text-primary h-4 w-4" />
      )}
      {sortDirection === 'desc' && (
        <ChevronDown className="text-primary h-4 w-4" />
      )}
      {sortDirection === false && (
        <ChevronsUpDown className="text-muted-foreground/60 h-3.5 w-3.5" />
      )}
    </div>
  </TableHead>
);

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn('text-muted-foreground mt-4 text-xs', className)}
    {...props}
  />
));
TableCaption.displayName = 'TableCaption';

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalRecords?: number;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalRecords,
}) => (
  <div className="border-border bg-card flex items-center justify-between border-t px-4 py-3">
    <div className="text-muted-foreground text-xs">
      {totalRecords !== undefined
        ? `Showing page ${currentPage} of ${totalPages} (${totalRecords} records)`
        : `Page ${currentPage} of ${totalPages}`}
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="border-input hover:bg-muted rounded border px-3 py-1 text-xs transition-colors disabled:opacity-40"
      >
        Previous
      </button>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="border-input hover:bg-muted rounded border px-3 py-1 text-xs transition-colors disabled:opacity-40"
      >
        Next
      </button>
    </div>
  </div>
);

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  SortableHead,
  TablePagination,
};
