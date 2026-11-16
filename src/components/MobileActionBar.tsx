import Link from 'next/link';
import { business } from '../data/business';

/** Fixed bottom bar on phones and tablets: one tap to call, text or open the estimate form. Hidden on desktop. */
export function MobileActionBar() {
  return (
    <nav className="mobile-bar" aria-label="Quick contact">
      <a href={`tel:${business.phone}`} data-analytics-location="mobile_bar" data-analytics-cta="call"><span aria-hidden="true">📞</span> Call</a>
      <a href={`sms:${business.phone}`} data-analytics-location="mobile_bar" data-analytics-cta="text"><span aria-hidden="true">💬</span> Text</a>
      <Link href="/contact#estimate" data-analytics-location="mobile_bar" data-analytics-cta="estimate_form"><span aria-hidden="true">📝</span> Estimate</Link>
    </nav>
  );
}
