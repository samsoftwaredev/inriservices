'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import { business, logoPath, navLinks } from '../data/business';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Escape closes the menu and returns focus to the toggle (WAI-ARIA disclosure pattern).
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${business.name} homepage`}>
          <Image className="brand-logo" src={logoPath} alt="" width={52} height={52} priority />
          <span className="brand-words"><strong>INRI</strong><small>Paint &amp; Wall</small></span>
        </Link>
        <nav aria-label="Primary navigation" id={menuId} className={`nav-links${open ? ' open' : ''}`}>
          {navLinks.map((item) => (
            <Link href={item.href} key={item.href} onClick={() => setOpen(false)}>{item.label}</Link>
          ))}
        </nav>
        <a href={`tel:${business.phone}`} className="header-phone" data-analytics-location="header" data-analytics-cta="call">Call for an Estimate</a>
        <button
          ref={buttonRef}
          type="button"
          className="menu-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="menu-icon" aria-hidden="true"><i /><i /><i /></span>
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>
    </header>
  );
}
