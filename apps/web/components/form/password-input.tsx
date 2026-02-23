'use client';

import { Button } from '@repo/ui/button';
import { Input } from '@repo/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      showPasswordLabel = 'Show password',
      hidePasswordLabel = 'Hide password',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    return (
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={`pr-10 ${className || ''}`}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={props.disabled}
          aria-label={showPassword ? hidePasswordLabel : showPasswordLabel}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Eye className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </div>
    );
  }
);
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
