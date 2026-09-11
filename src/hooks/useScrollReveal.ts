import { useEffect, useRef, useState, CSSProperties } from 'react';

export type ScrollAnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'fade-in'
  | 'scale-up';

export interface UseScrollRevealOptions {
  animation?: ScrollAnimationType;
  delay?: number; // delay in ms
  duration?: number; // duration in ms
  threshold?: number; // 0.0 - 1.0 (default 0.12)
  rootMargin?: string;
  triggerOnce?: boolean;
  disabled?: boolean;
}

/**
 * useScrollReveal
 * High-performance hook using IntersectionObserver to trigger smooth fade-in
 * and translate animations as cards and sections scroll into viewport.
 * Automatically respects user's prefers-reduced-motion OS preference.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const {
    animation = 'fade-up',
    delay = 0,
    duration = 650,
    threshold = 0.1,
    rootMargin = '0px 0px -40px 0px',
    triggerOnce = true,
    disabled = false,
  } = options;

  const elementRef = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If disabled or running in SSR / environments without IntersectionObserver
    if (disabled || typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    // Respect user OS setting for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce, disabled]);

  const getAnimationClass = () => {
    const base = 'scroll-reveal';
    const variant = `scroll-reveal-${animation}`;
    const visible = isVisible ? 'scroll-reveal-visible' : '';
    return `${base} ${variant} ${visible}`.trim();
  };

  const getAnimationStyle = (): CSSProperties => {
    return {
      transitionDelay: `${delay}ms`,
      transitionDuration: `${duration}ms`,
    };
  };

  return {
    ref: elementRef,
    isVisible,
    className: getAnimationClass(),
    style: getAnimationStyle(),
  };
}
