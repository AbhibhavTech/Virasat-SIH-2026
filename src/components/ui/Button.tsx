import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'warm';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 text-white hover:from-amber-800 hover:to-amber-950 shadow-sm border border-amber-900/20 active:scale-[0.99]',
  warm: 'bg-[#FF671F] hover:bg-[#E65100] text-white shadow-xs active:scale-[0.99]',
  secondary: 'bg-stone-100 hover:bg-stone-200/80 text-stone-800 border border-stone-200/80 active:scale-[0.99]',
  outline: 'bg-white hover:bg-amber-50/60 text-stone-800 border border-stone-300 hover:border-amber-600/60 active:scale-[0.99]',
  ghost: 'bg-transparent hover:bg-stone-100 text-stone-700 hover:text-stone-900',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs active:scale-[0.99]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5 min-h-[36px]',
  md: 'px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl gap-2 min-h-[40px]',
  lg: 'px-5 py-2.5 text-sm sm:text-base font-bold rounded-xl gap-2.5 min-h-[44px]',
  icon: 'p-2 rounded-xl text-stone-600 hover:text-stone-900 min-h-[40px] min-w-[40px] justify-center',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-sans transition-all duration-150 select-none cursor-pointer ' +
      'focus-visible:ring-2 focus-visible:ring-amber-600 focus-visible:ring-offset-1 focus-visible:outline-none ' +
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin shrink-0" aria-hidden="true" />
            <span>{children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0" aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
