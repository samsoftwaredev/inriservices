import { business } from '../data/business';

export function ContactActions({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`contact-actions ${compact ? 'compact' : ''}`}>
      <a className="button primary" href={`tel:${business.phone}`} aria-label={`Call ${business.name} at ${business.phoneDisplay}`}>
        Call {business.phoneDisplay}
      </a>
      <a className="button outline" href={`mailto:${business.email}?subject=Painting%20or%20drywall%20estimate`}>
        Request an Estimate
      </a>
    </div>
  );
}
