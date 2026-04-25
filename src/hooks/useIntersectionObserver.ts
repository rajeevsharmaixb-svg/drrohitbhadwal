import { useEffect, useState, useRef, RefObject } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useIntersectionObserver(
  ref: RefObject<Element | null>,
  { threshold = 0, rootMargin = '0px', once = true }: UseIntersectionObserverProps = {}
): boolean {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIntersecting(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold, rootMargin, once]);

  return isIntersecting;
}
