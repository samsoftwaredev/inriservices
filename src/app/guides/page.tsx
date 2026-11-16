import type { Metadata } from 'next';
import Link from 'next/link';
import { guides, guidePath } from '../../data/guides';
import { pageMetadata } from '../../lib/seo';
import { Callout } from '../../components/Callout';

export const metadata: Metadata = pageMetadata({
  title: 'Painting & Drywall Guides for Texas Homeowners',
  description: 'Practical guides from INRI Paint & Wall: popcorn ceiling asbestos, why drywall cracks return in North Texas, patch sizes and how to prepare for a painter.',
  path: '/guides',
});

export default function GuidesPage() {
  return (
    <main id="main-content">
      <section className="page-hero"><div className="container narrow">
        <p className="eyebrow">Guides</p>
        <h1>Painting and drywall guides</h1>
        <p>Straight answers to common questions from homeowners in Garland and the Dallas area.</p>
      </div></section>
      <section className="section"><div className="container">
        <div className="guide-list">
          {guides.map((g) => (
            <article className="guide-card" key={g.slug}>
              <h2><Link href={guidePath(g.slug)}>{g.title}</Link></h2>
              <p>{g.summary}</p>
              <Link className="text-link" href={guidePath(g.slug)}>Read the guide <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </div></section>
      <div className="container"><Callout /></div>
    </main>
  );
}
