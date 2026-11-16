import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { areas, areaPath, getArea } from '../../../data/areas';
import { services } from '../../../data/services';
import { areaServiceJsonLd, breadcrumbJsonLd, pageMetadata, safeJsonLd } from '../../../lib/seo';
import { FaqList } from '../../../components/FaqList';
import { Callout } from '../../../components/Callout';
import { ContactActions } from '../../../components/ContactActions';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() { return areas.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) return { title: 'Service area not found', robots: { index: false, follow: false } };
  return pageMetadata({ title: area.metaTitle, description: area.metaDescription, path: areaPath(slug) });
}

export default async function AreaPage({ params }: Props) {
  const { slug } = await params;
  const area = getArea(slug);
  if (!area) notFound();
  const path = areaPath(area.slug);
  const nearby = area.nearby.flatMap((s) => { const a = getArea(s); return a ? [a] : []; });
  const jsonLd = [
    breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Service Areas', path: '/areas' }, { name: `${area.name}, TX`, path }]),
    areaServiceJsonLd({ name: area.name, path }),
  ];
  return (
    <main id="main-content">
      <section className="page-hero"><div className="container narrow">
        <nav aria-label="Breadcrumb" className="breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><Link href="/areas">Service Areas</Link><span aria-hidden="true"> / </span><span aria-current="page">{area.name}, TX</span></nav>
        <p className="eyebrow">{area.name}, Texas • Painting &amp; drywall</p>
        <h1>Painting &amp; drywall repair in {area.name}, TX</h1>
        <p>{area.lead}</p>
        <ContactActions compact />
      </div></section>
      <section className="section"><div className="container reading-content">
        <h2>{area.contextHeading}</h2>
        {area.context.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        <h2>{area.needsHeading}</h2>
        <div className="info-grid">
          {area.needs.map((need) => (
            <div className="info-card" key={need.title}>
              <h3>{need.title}</h3>
              <p>{need.text}</p>
              <Link className="text-link" href={`/services/${need.serviceSlug}`}>{services.find((s) => s.slug === need.serviceSlug)?.shortTitle ?? 'Learn more'} <span aria-hidden="true">→</span></Link>
            </div>
          ))}
        </div>
        <h2>{area.goodToKnowHeading}</h2>
        <p>{area.goodToKnow}</p>
        <h2>Services available in {area.name}</h2>
        <ul>{services.map((service) => <li key={service.slug}><Link href={`/services/${service.slug}`}>{service.shortTitle} in {area.name}</Link>: {service.summary}</li>)}</ul>
        <h2>{area.name} painting questions</h2>
        <FaqList questions={area.questions} />
        <h2>Also serving nearby communities</h2>
        <ul className="city-links">{nearby.map((a) => <li key={a.slug}><Link href={areaPath(a.slug)}>{a.name}, TX</Link></li>)}<li><Link href="/areas">All service areas</Link></li></ul>
      </div></section>
      <div className="container"><Callout title={`Planning a project in ${area.name}?`} message={`Tell us what you want painted or repaired and the address in ${area.name}. We can talk through the next step and whether an on-site estimate is needed.`} /></div>
      {jsonLd.map((data, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} />)}
    </main>
  );
}
