'use client';
import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Scroll-triggered entrance for a group of children, using the same "rise" motion as the hero.
 * Progressive enhancement: server HTML is fully visible. Only after hydration, and only if
 * IntersectionObserver exists, are children armed (hidden) and then revealed one by one as
 * they scroll into view. CSS gates all of it behind prefers-reduced-motion: no-preference.
 */
export function RevealGroup({ children, className, columns = 3 }: { children: ReactNode; className?: string; columns?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const items = Array.from(el.children) as HTMLElement[];
    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) { (entry.target as HTMLElement).dataset.in = ''; io.unobserve(entry.target); }
      }
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    items.forEach((item, i) => { item.style.setProperty('--i', String(i % columns)); io.observe(item); });
    el.dataset.reveal = 'ready';
    return () => { io.disconnect(); delete el.dataset.reveal; items.forEach((item) => delete item.dataset.in); };
  }, [columns]);
  return <div ref={ref} className={className}>{children}</div>;
}
