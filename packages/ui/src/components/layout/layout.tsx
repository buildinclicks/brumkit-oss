import * as React from 'react';

import { cn } from '../../lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum width of the container */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const containerSizes = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

/**
 * Container - Responsive container with max-width
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mx-auto w-full px-4 sm:px-6 lg:px-8',
          containerSizes[size],
          className
        )}
        {...props}
      />
    );
  }
);
Container.displayName = 'Container';

export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction of the stack */
  direction?: 'row' | 'column';
  /** Spacing between items */
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Alignment of items */
  align?: 'start' | 'center' | 'end' | 'stretch';
  /** Justify content */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

const stackSpacing = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const stackAlign = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const stackJustify = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

/**
 * Stack - Flex container for vertical or horizontal stacking
 */
export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (
    {
      className,
      direction = 'column',
      spacing = 'md',
      align = 'stretch',
      justify = 'start',
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          direction === 'column' ? 'flex-col' : 'flex-row',
          stackSpacing[spacing],
          stackAlign[align],
          stackJustify[justify],
          className
        )}
        {...props}
      />
    );
  }
);
Stack.displayName = 'Stack';
