import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { services, getService } from '../../../data/services';
import { breadcrumbJsonLd, pageMetadata, safeJsonLd, serviceJsonLd } from '../../../lib/seo';
import { FaqList } from '../../../components/FaqList';
import { PricingPackages } from '../../../components/PricingPackages';
import { Callout } from '../../../components/Callout';
import { CrewFigure } from '../../../components/CrewFigure';
import { servicePhotoKeys } from '../../../data/team';
import { areas, areaPath } from '../../../data/areas';

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return services.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return { title: 'Service not found', robots: { index: false, follow: false } };
  return pageMetadata({
    title: service.title,
    description: `${service.description} Contact INRI Paint & Wall LLC for a Garland-area estimate.`,
    path: `/services/${slug}`, imageKey: slug,
  });
}
export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const path = `/services/${service.slug}`;
  const jsonLd = [
    breadcrumbJsonLd([{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }, { name: service.shortTitle, path }]),
    serviceJsonLd({ name: service.title, description: service.description, path }),
  ];
  return <main id="main-content"><section className="page-hero"><div className="container narrow"><nav aria-label="Breadcrumb" className="breadcrumb"><Link href="/">Home</Link><span aria-hidden="true"> / </span><Link href="/services">Services</Link><span aria-hidden="true"> / </span><span aria-current="page">{service.shortTitle}</span></nav><p className="eyebrow">{service.shortTitle} • Garland and nearby cities</p><h1>{service.title}</h1><p>{service.description}</p><Link className="button primary" href="/contact">Request an Estimate</Link></div></section>
    <section className="section"><div className="container reading-content"><h2>What this service involves</h2><p>{service.details}</p>{servicePhotoKeys[service.slug]&&<CrewFigure photoKey={servicePhotoKeys[service.slug]} />}<h2>Common parts of the work</h2><ul>{service.tasks.map(item=><li key={item}>{item}</li>)}</ul><h2>How we approach the project</h2><ol>{service.process.map(item=><li key={item}>{item}</li>)}</ol><h2>What affects the price</h2><p>Cost depends on size and access, surface condition, materials and finish, and the preparation needed. Estimates are free, and we confirm the scope before work starts. See <Link href="/pricing-and-estimates">how our estimates work</Link>.</p>{service.slug==='drywall-repair'&&<><h3>Patch repair pricing</h3><PricingPackages /></>}<h2>Questions about {service.shortTitle.toLowerCase()}</h2><FaqList questions={service.questions}/><h2>Where we offer {service.shortTitle.toLowerCase()}</h2><ul className="city-links">{areas.map(a=><li key={a.slug}><Link href={areaPath(a.slug)}>{service.shortTitle} in {a.name}</Link></li>)}</ul><p className="service-return"><Link href="/services">← See all painting and repair services</Link></p></div></section><div className="container"><Callout title={`Need help with ${service.shortTitle.toLowerCase()}?`} /></div>{jsonLd.map((data, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(data) }} />)}</main>;
}
