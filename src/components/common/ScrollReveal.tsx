import React, { ElementType, HTMLAttributes, ReactNode, forwardRef } from 'react';
import { useScrollReveal, UseScrollRevealOptions, ScrollAnimationType } from '../../hooks/useScrollReveal';

export type { ScrollAnimationType, UseScrollRevealOptions };

export interface ScrollRevealProps extends HTMLAttributes<HTMLElement>, UseScrollRevealOptions {
  as?: ElementType;
  children?: ReactNode;
  className?: string;
}

/**
 * ScrollReveal
 * Reusable IntersectionObserver-based wrapper component that applies
 * buttery-smooth fade and entrance transitions as elements enter viewport.
 */
export const ScrollReveal = forwardRef<HTMLElement, ScrollRevealProps>(function ScrollReveal(
  {
    as: Component = 'div',
    children,
    className = '',
    animation = 'fade-up',
    delay = 0,
    duration = 650,
    threshold = 0.1,
    rootMargin = '0px 0px -40px 0px',
    triggerOnce = true,
    disabled = false,
    style,
    ...rest
  },
  forwardedRef
) {
  const { ref, className: revealClass, style: revealStyle } = useScrollReveal({
    animation,
    delay,
    duration,
    threshold,
    rootMargin,
    triggerOnce,
    disabled,
  });

  const setRefs = (node: HTMLElement | null) => {
    (ref as React.MutableRefObject<HTMLElement | null>).current = node;
    if (typeof forwardedRef === 'function') {
      forwardedRef(node);
    } else if (forwardedRef) {
      (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  return (
    <Component
      ref={setRefs}
      className={`${revealClass} ${className}`.trim()}
      style={{
        ...revealStyle,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
});
