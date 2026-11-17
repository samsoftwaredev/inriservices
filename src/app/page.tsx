import Link from 'next/link';
import type { Metadata } from 'next';
import { services } from '../data/services';
import { defaultDescription, pageMetadata } from '../lib/seo';
import { ContactActions } from '../components/ContactActions';
import { GoogleFormEmbed } from '../components/GoogleFormEmbed';
import { ServiceCard } from '../components/ServiceCard';
import { SectionHeading } from '../components/SectionHeading';
import { Callout } from '../components/Callout';
import { TeamSection } from '../components/TeamSection';
import { BeforeAfter } from '../components/BeforeAfter';
import { ProjectGallery } from '../components/ProjectGallery';
import { PricingPackages } from '../components/PricingPackages';
import { Reviews } from '../components/Reviews';
import { RevealGroup } from '../components/RevealGroup';
import { areas, areaPath } from '../data/areas';
import { business, estimateFee, trustPoints } from '../data/business';

export const metadata: Metadata = pageMetadata({
  title: 'House Painters & Drywall Repair in Garland, TX',
  description: defaultDescription,
  path: '/',
  languages: { 'en-US': '/', 'es-US': '/es', 'x-default': '/' },
});

export default function HomePage() {
  return (
    <main id="main-content">
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Garland, Texas • Painting &amp; drywall services</p>
            <h1>Painting &amp; drywall repair <em>in Garland, TX.</em></h1>
            <p className="hero-lead">Interior and exterior painting, drywall repairs, cabinet painting, ceiling work and trim repairs for homes in Garland and nearby communities.</p>
            <ContactActions location="home_hero" estimateHref="#estimate" />
            <p className="hero-note">Locally operated. Clear estimates. Respect for your home.</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <svg className="hero-roller" viewBox="0 0 320 340" focusable="false">
              <defs>
                <linearGradient id="rollerBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#5E9BE6" /><stop offset=".45" stopColor="#1F5FBF" /><stop offset="1" stopColor="#123B80" /></linearGradient>
                <linearGradient id="rollerCap" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#0B2545" /><stop offset="1" stopColor="#2B5C9E" /></linearGradient>
              </defs>
              <ellipse cx="170" cy="318" rx="92" ry="12" fill="#0B2545" opacity=".14" />
              <rect x="40" y="28" width="220" height="92" rx="46" fill="url(#rollerBody)" />
              <rect x="58" y="42" width="150" height="16" rx="8" fill="#fff" opacity=".35" />
              <rect x="252" y="62" width="36" height="22" rx="11" fill="url(#rollerCap)" />
              <path d="M270 73h24a20 20 0 0 1 20 20v26a20 20 0 0 1-20 20h-96a20 20 0 0 0-20 20v28" fill="none" stroke="#0B2545" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="164" y="186" width="30" height="112" rx="15" fill="url(#rollerCap)" />
              <rect x="170" y="196" width="7" height="86" rx="3.5" fill="#fff" opacity=".28" />
            </svg>
            <span className="hero-chip">Walls • Ceilings • Cabinets</span>
          </div>
        </div>
      </section>
      <ul className="container trust-strip" aria-label="Why homeowners choose us">{trustPoints.map(point => <li key={point}>{point}</li>)}</ul>
      <section className="section" aria-label="Painting and repair services">
        <div className="container">
          <SectionHeading reveal eyebrow="What we do" title="Painting and repair services" description="From a single damaged wall to larger repainting projects, we discuss the surface condition and scope before recommending a finish." />
          <RevealGroup className="services-grid">{services.map(service => <ServiceCard key={service.slug} service={service} />)}</RevealGroup>
          <div className="centered-link"><Link className="text-link" href="/services">View all services <span aria-hidden="true">→</span></Link></div>
        </div>
      </section>
      <TeamSection />
      <section className="section section-tint" id="before-after" aria-label="Before and after"><div className="container">
        <SectionHeading reveal eyebrow="Before &amp; after" title="Real results from our projects" description="Photos from jobs we completed: repairs, repaints and refinishing." />
        <BeforeAfter />
      </div></section>
      <section className="section section-tint" id="our-work" aria-label="Our work"><div className="container">
        <SectionHeading reveal eyebrow="Our work" title="What we can do for you" description="Take a look at some of the transformations. We bring your vision to life with precision and care." />
        <ProjectGallery />
      </div></section>
      <section className="section" id="pricing" aria-label="Pricing and packages"><div className="container">
        <SectionHeading reveal eyebrow="Pricing" title="Our pricing &amp; packages" description="Straightforward starting prices for drywall patch repairs." />
        <PricingPackages />
      </div></section>
      <section className="section section-tint" id="reviews" aria-label="Customer reviews"><div className="container">
        <SectionHeading reveal eyebrow="Reviews" title="What customers say" />
        <Reviews />
      </div></section>
      <section className="section section-tint" aria-label="How our painting process works"><div className="container">
        <SectionHeading eyebrow="Our approach" title="A thoughtful process from estimate to cleanup" />
        <div className="steps-grid">
          <div><span className="step-number">01</span><h3>Discuss your project</h3><p>Explain the area, current surface and the results you want.</p></div>
          <div><span className="step-number">02</span><h3>Review the preparation</h3><p>We identify repairs, protection, surface prep and finish needs before work starts.</p></div>
          <div><span className="step-number">03</span><h3>Paint, repair and finish</h3><p>Complete the agreed scope, tidy the space and review the finished work.</p></div>
        </div>
      </div></section>
      <section className="section"><div className="container narrow-local">
        <div><p className="eyebrow">Local service</p><h2>Painting and drywall work around Garland</h2><p>We are based in Garland and serve homeowners in nearby communities. Project availability depends on the property and work involved.</p><ul className="city-links">{areas.map(area => <li key={area.slug}><Link href={areaPath(area.slug)}>{area.name}, TX</Link></li>)}</ul><Link href="/areas" className="text-link">Explore service areas <span aria-hidden="true">→</span></Link></div>
      </div></section>
      <section className="section section-tint" id="estimate" aria-label="Request an estimate"><div className="container split-content estimate-split">
        <div>
          <p className="eyebrow">Need an estimate?</p>
          <h2>Tell us about the surfaces you need help with</h2>
          <p>{estimateFee.summary}</p>
          <p>Fill out the form, or call or text {business.phoneDisplay}. Include the location, the type of work and the approximate size.</p>
          <ContactActions compact location="home_estimate" estimateHref="#estimate-form" />
        </div>
        <div className="quote-panel" id="estimate-form"><GoogleFormEmbed /></div>
      </div></section>
      <div className="container"><Callout /></div>
    </main>
  );
}
