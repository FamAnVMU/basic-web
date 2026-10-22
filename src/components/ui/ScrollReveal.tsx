import React, { useEffect, useRef, useState } from 'react';

export type ScrollAnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'flip-up';

export interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: ScrollAnimationType;
  delay?: number; // Delay in milliseconds
  duration?: number; // Duration in milliseconds
  className?: string;
  threshold?: number;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 750,
  className = '',
  threshold = 0.12,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Use IntersectionObserver for high-performance scroll triggers
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [threshold, once]);

  const getAnimationClasses = () => {
    if (isVisible) {
      return 'opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0 [transform:none]';
    }

    switch (animation) {
      case 'fade-up':
        return 'opacity-0 translate-y-10';
      case 'fade-down':
        return 'opacity-0 -translate-y-10';
      case 'fade-left':
        return 'opacity-0 -translate-x-10';
      case 'fade-right':
        return 'opacity-0 translate-x-10';
      case 'zoom-in':
        return 'opacity-0 scale-90';
      case 'flip-up':
        return 'opacity-0 [transform:perspective(800px)_rotateX(18deg)_translateY(28px)]';
      default:
        return 'opacity-0 translate-y-10';
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className={`transition-all will-change-transform ${getAnimationClasses()} ${className}`}
    >
      {children}
    </div>
  );
};
