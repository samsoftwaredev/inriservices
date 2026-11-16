import Link from 'next/link';
import type { Service } from '../data/services';
export function ServiceCard({ service }: { service: Service }) {
  return (
    <article className="service-card">
      <span className="service-icon" aria-hidden="true">{service.icon}</span>
      <h3><Link href={`/services/${service.slug}`}>{service.shortTitle}</Link></h3>
      <p>{service.summary}</p>
      <Link className="text-link" href={`/services/${service.slug}`}>Explore service <span aria-hidden="true">→</span></Link>
    </article>
  );
}
