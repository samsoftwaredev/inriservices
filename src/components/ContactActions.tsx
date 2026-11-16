import Link from 'next/link';
import { business } from '../data/business';

/** `location` labels where the click happened so GA4 can show which placement drives calls, texts and estimates. */
export function ContactActions({ compact = false, location }: { compact?: boolean; location?: string }) {
  const where = location ?? (compact ? 'callout' : 'primary_cta');
  return (
    <div className={`contact-actions ${compact ? 'compact' : ''}`}>
      <a className="button primary" href={`tel:${business.phone}`} data-analytics-location={where} data-analytics-cta="call">
        Call {business.phoneDisplay}
      </a>
      <a className="button outline" href={`sms:${business.phone}`} data-analytics-location={where} data-analytics-cta="text">
        Text us
      </a>
      <Link className="button outline" href="/contact#estimate" data-analytics-location={where} data-analytics-cta="estimate_form">
        Request an Estimate
      </Link>
    </div>
  );
}
