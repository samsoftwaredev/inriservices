import type { Metadata } from 'next';
import { pageMetadata } from '../../lib/seo';
import { services } from '../../data/services';
import { ServiceCard } from '../../components/ServiceCard';
import { Callout } from '../../components/Callout';
export const metadata: Metadata = pageMetadata({ title: 'Painting, Drywall & Ceiling Services in Garland', description: 'Explore interior and exterior painting, drywall and texture repair, cabinet finishing, popcorn ceiling work and trim repair from INRI Paint & Wall.', path: '/services' });
export default function ServicesPage(){return <main id="main-content"><section className="page-hero"><div className="container narrow"><p className="eyebrow">Services</p><h1>Painting, drywall and finishing</h1><p>Review the work we offer and learn what each service involves before requesting an estimate.</p></div></section><section className="section"><div className="container"><div className="services-grid">{services.map(service=><ServiceCard service={service} key={service.slug}/>)}</div></div></section><div className="container"><Callout/></div></main>}
