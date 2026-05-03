'use client';

import { useEffect } from 'react';

/**
 * Controller that registers IntersectionObsever to trigger scroll animations.
 * Should be mounted globally or closely wrapping pages with scroll animations.
 */
export default function ScrollAnimController() {
  useEffect(() => {
    // Check for reduced motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      document.querySelectorAll('.anim-item, .anim-icon, .anim-heading, .anim-card').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('anim-group')) {
            const items = entry.target.querySelectorAll('.anim-item, .anim-icon, .anim-heading, .anim-card');
            items.forEach((el, i) => {
              const htmlEl = el as HTMLElement;
              htmlEl.style.transitionDelay = `${Math.min(i * 25, 100)}ms`;
              htmlEl.classList.add('is-visible');
            });
          }
          
          if (
            entry.target.classList.contains('anim-item') ||
            entry.target.classList.contains('anim-icon') ||
            entry.target.classList.contains('anim-heading') ||
            entry.target.classList.contains('anim-card')
          ) {
            entry.target.classList.add('is-visible');
          }
        } else {
          if (entry.target.classList.contains('anim-group')) {
            const items = entry.target.querySelectorAll('.fade-out-on-exit');
            items.forEach(el => el.classList.remove('is-visible'));
          }

          if (entry.target.classList.contains('fade-out-on-exit')) {
            entry.target.classList.remove('is-visible');
          }
        }
      });
    }, { 
      threshold: 0.15, 
      rootMargin: '0px 0px -15% 0px' 
    });

    const observedElements = new Set<Element>();

    const observeElements = () => {
      const groupsAndItems = document.querySelectorAll('.anim-group, .anim-item, .anim-icon, .anim-heading, .anim-card');
      groupsAndItems.forEach(el => {
        if (!observedElements.has(el)) {
          observer.observe(el);
          observedElements.add(el);
        }
      });
    };

    // Initial observation
    observeElements();

    // Observe future additions
    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
