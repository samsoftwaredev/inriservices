'use client';
import { useEffect, useRef } from 'react';
import { business, contactFormEmbedUrl, contactFormUrl } from '../data/business';
import { trackEvent } from './Analytics';

/**
 * Embeds the Google Form used for estimate requests. The form itself (required questions, email alerts)
 * is configured in Google Forms. Google does not tell the page when a form is submitted, so we infer it:
 * the first iframe load is the blank form and a later load is Google's confirmation page.
 * (If the form is ever split into several pages, each page change also counts as a load.)
 */
export function GoogleFormEmbed() {
  const frame = useRef<HTMLIFrameElement>(null);
  const loads = useRef(0);
  const started = useRef(false);
  const submitted = useRef(false);

  useEffect(() => {
    // Clicking or typing in a cross-origin iframe blurs the window while the iframe is the active element.
    const onBlur = () => {
      if (!started.current && document.activeElement === frame.current) {
        started.current = true;
        trackEvent('form_start', { form_name: 'estimate_request', method: 'google_form' });
      }
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, []);

  return (
    <div className="gform">
      <p className="form-note">Name, phone, email and a short description of the work are required.</p>
      <iframe
        ref={frame}
        className="gform-frame"
        src={contactFormEmbedUrl}
        title="Estimate request form"
        loading="lazy"
        onLoad={() => {
          loads.current += 1;
          if (loads.current > 1 && !submitted.current) {
            submitted.current = true;
            trackEvent('generate_lead', { method: 'google_form', form_location: window.location.pathname });
          }
        }}
      >
        Loading…
      </iframe>
      <p className="form-note">
        Form not loading? <a href={contactFormUrl} target="_blank" rel="noopener noreferrer">Open it in a new tab<span className="visually-hidden"> (opens in a new tab)</span></a>.
        Have photos of the job? Text them to <a href={`sms:${business.phone}`} data-analytics-cta="text" data-analytics-location="form_photos">{business.phoneDisplay}</a> or email <a href={`mailto:${business.email}`}>{business.email}</a>.
      </p>
    </div>
  );
}
