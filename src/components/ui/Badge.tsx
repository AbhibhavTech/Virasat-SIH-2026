import React from 'react';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'official' | 'curated';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-amber-50 text-amber-900 border-amber-200/80',
  success: 'bg-emerald-50 text-emerald-900 border-emerald-200/80',
  warning: 'bg-orange-50 text-orange-900 border-orange-200/80',
  danger: 'bg-rose-50 text-rose-900 border-rose-200/80',
  neutral: 'bg-stone-100 text-stone-800 border-stone-200',
  official: 'bg-amber-100/70 text-amber-950 border-amber-300 font-bold',
  curated: 'bg-amber-50 text-amber-950 border-amber-300',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-[10px] gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
  ...props
}) => {
  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border tracking-wide select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
