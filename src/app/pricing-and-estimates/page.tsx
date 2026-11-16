import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '../../lib/seo';
import { PricingPackages } from '../../components/PricingPackages';
import { Callout } from '../../components/Callout';
export const metadata: Metadata = pageMetadata({ title: 'Painting & Drywall Estimates in Garland', description: 'Learn what affects painting, drywall, cabinet and ceiling project estimates in Garland, TX. Contact INRI Paint & Wall LLC to discuss the scope of work.', path: '/pricing-and-estimates' });
const considerations = [
  {title:'Size and access',copy:'Walls, ceilings, height, number of rooms and how easily surfaces can be reached.'},
  {title:'Surface condition',copy:'Holes, cracking, wood damage, peeling coatings, moisture issues or texture blending.'},
  {title:'Materials and finish',copy:'Paint type, sheen, number of finish coats, primer and whether materials are included.'},
  {title:'Preparation',copy:'Protection, cleaning, sanding, caulking, masking and any required repair work.'},
];
export default function EstimatesPage(){return <main id="main-content"><section className="page-hero"><div className="container narrow"><p className="eyebrow">Estimates</p><h1>Clear painting and drywall project estimates</h1><p>Drywall patch repairs have clear starting prices. Larger or more complex projects depend on your actual surfaces and scope, so we review the work before quoting.</p></div></section><section className="section"><div className="container"><h2>Patch repair pricing &amp; packages</h2><PricingPackages /><h2 className="after-block">What determines the project cost?</h2><div className="info-grid">{considerations.map(item=><article key={item.title} className="info-card"><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div><div className="reading-content"><h2>How to request an estimate</h2><ol><li>Tell us your property location and the service you need.</li><li>Describe the size and condition of the surfaces. Photos may help us understand the project.</li><li>We will discuss the next steps and whether an in-person assessment is required.</li></ol><p>See our <Link href="/services">services</Link> and <Link href="/contact">contact options</Link>.</p></div></div></section><div className="container"><Callout /></div></main>}
