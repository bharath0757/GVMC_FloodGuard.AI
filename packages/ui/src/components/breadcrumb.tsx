import * as React from 'react';
import { cn } from '@floodguard/utils';
import { ChevronRight } from 'lucide-react';

/**
 * Storybook & Component Documentation: Breadcrumb Suite
 *
 * **Purpose:** Navigation path hierarchy indicator.
 * **Usage:** `<Breadcrumb><BreadcrumbItem><BreadcrumbLink href="#">Dashboard</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbPage>Ward 14</BreadcrumbPage></Breadcrumb>`
 * **Accessibility Notes:** `<nav aria-label="Breadcrumb">` with `aria-current="page"`.
 */

const Breadcrumb = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
  <nav
    ref={ref}
    aria-label="Breadcrumb"
    className={cn('text-muted-foreground flex items-center text-sm', className)}
    {...props}
  />
));
Breadcrumb.displayName = 'Breadcrumb';

const BreadcrumbList: React.FC<React.OlHTMLAttributes<HTMLOListElement>> = ({
  className,
  ...props
}) => (
  <ol
    className={cn(
      'text-muted-foreground flex flex-wrap items-center gap-1.5 break-words text-sm',
      className,
    )}
    {...props}
  />
);

const BreadcrumbItem: React.FC<React.LiHTMLAttributes<HTMLLIElement>> = ({
  className,
  ...props
}) => (
  <li
    className={cn('inline-flex items-center gap-1.5', className)}
    {...props}
  />
);

const BreadcrumbLink: React.FC<
  React.AnchorHTMLAttributes<HTMLAnchorElement>
> = ({ className, ...props }) => (
  <a
    className={cn(
      'hover:text-foreground underline-offset-4 transition-colors hover:underline',
      className,
    )}
    {...props}
  />
);

const BreadcrumbSeparator: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  children,
  className,
  ...props
}) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('opacity-60 [&>svg]:h-3.5 [&>svg]:w-3.5', className)}
    {...props}
  >
    {children || <ChevronRight />}
  </span>
);

const BreadcrumbPage: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  ...props
}) => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn('text-foreground font-medium', className)}
    {...props}
  />
);

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
};
