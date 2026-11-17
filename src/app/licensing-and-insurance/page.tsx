import type { Metadata } from 'next';
import { pageMetadata } from '../../lib/seo';
import { business } from '../../data/business';
import { Callout } from '../../components/Callout';

export const metadata: Metadata = pageMetadata({
  title: 'Licensing, Insurance & Certifications',
  description: 'INRI Paint & Wall LLC is licensed and insured with general liability and workers\' compensation coverage, and OSHA 10 safety trained.',
  path: '/licensing-and-insurance',
});

/** Facts below are published by the owner on the existing site. Confirm they are current before launch. */
const coverage = [
  { title: 'General liability insurance', text: '$1,100,000 coverage that protects your property from accidental damage during our work. Provider: State National Insurance Company, Inc.' },
  { title: "Workers' compensation", text: "All employees are covered, so you are not responsible if a worker is injured on your property." },
];
const credentials = [
  { title: 'OSHA 10-hour construction safety', text: 'Team members are trained in workplace safety standards and protocols.' },
];

export default function LicensingPage() {
  return (
    <main id="main-content">
      <section className="page-hero"><div className="container narrow">
        <p className="eyebrow">Licensing &amp; insurance</p>
        <h1>Licensed, insured and certified</h1>
        <p>Your home is protected while we work. Documentation is available on request with your estimate.</p>
      </div></section>
      <section className="section"><div className="container reading-content">
        <h2>Active insurance coverage</h2>
        <div className="fact-list">{coverage.map((c) => <div className="fact-card" key={c.title}><h3>{c.title}</h3><p>{c.text}</p></div>)}</div>
        <h2>Certifications and training</h2>
        <div className="fact-list">{credentials.map((c) => <div className="fact-card" key={c.title}><h3>{c.title}</h3><p>{c.text}</p></div>)}</div>
        <h2>What this means for you</h2>
        <ul>
          <li>Accidental damage during the work is covered by liability insurance.</li>
          <li>Workers&apos; compensation means you are not liable for worker injuries.</li>
          <li>Safety training for every team member on site.</li>
        </ul>
        <p>To receive a copy of our insurance certificate, ask for it when you request an estimate by calling <a href={`tel:${business.phone}`}>{business.phoneDisplay}</a> or emailing <a href={`mailto:${business.email}?subject=Insurance%20certificate%20request`}>{business.email}</a>.</p>
      </div></section>
      <div className="container"><Callout title="Ready to work with a trusted painter?" /></div>
    </main>
  );
}
