'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type AnalyticsValue = string | number | boolean;
type AnalyticsParams = Record<string, AnalyticsValue>;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

/**
 * Sends a GA4 event only when a measurement ID is configured. Never pass form values here.
 * Before gtag.js loads, commands must be queued as `arguments` objects (not arrays), which is the
 * only shape gtag.js replays; plain arrays are ignored and the first page_view would be lost.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function queueGtag(..._args: unknown[]) {
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
}

export function trackEvent(name: string, params: AnalyticsParams = {}) {
  if (typeof window === 'undefined' || !measurementId) return;
  (window.gtag ?? queueGtag)('event', name, params);
}

function PageViewTracker() {
  const pathname = usePathname();
  useEffect(() => {
    trackEvent('page_view', { page_path: pathname, page_title: document.title });
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest('a') : null;
      if (!target) return;
      const href = target.getAttribute('href') ?? '';
      const location = target.getAttribute('data-analytics-location') ?? 'site';
      if (href.startsWith('tel:')) trackEvent('phone_click', { link_location: location });
      if (href.startsWith('sms:')) trackEvent('sms_click', { link_location: location });
      if (href.startsWith('mailto:')) trackEvent('email_click', { link_location: location });
      if (target.hasAttribute('data-analytics-cta')) trackEvent('select_content', { content_type: 'cta', item_id: target.getAttribute('data-analytics-cta') ?? location });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}

export function Analytics() {
  if (!measurementId) return null;
  const safeMeasurementId = JSON.stringify(measurementId);
  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){window.dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', ${safeMeasurementId}, {
  send_page_view: false,
  allow_google_signals: false,
  allow_ad_personalization_signals: false
});`}
      </Script>
      <PageViewTracker />
    </>
  );
}
