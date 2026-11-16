import type { Metadata } from 'next';
import Link from 'next/link';
import { pageMetadata } from '../../lib/seo';
import { Callout } from '../../components/Callout';

export const metadata: Metadata = pageMetadata({
  title: 'Environmental & Safety Practices',
  description: 'Low-VOC paint options, EPA lead-safe practices, dust containment and job site safety from INRI Paint & Wall LLC, a Garland, TX painting contractor.',
  path: '/environmental-and-safety-practices',
});

/** Practices below are published by the owner on the existing site. Confirm they are current before launch. */
const sections = [
  { title: 'Low-VOC and eco-friendly paint', items: ['Low-VOC and zero-VOC paint available on request', 'Reduces indoor air pollution and odors, helpful for children, pets and sensitive people', 'Options from major brands such as Sherwin-Williams and Benjamin Moore', 'Low-odor formulas mean you can return to the space sooner'] },
  { title: 'Lead-safe practices (EPA RRP)', items: ['Required for homes built before 1978', 'Proper containment and cleanup procedures', 'Testing available if lead paint is suspected', 'Documentation provided'] },
  { title: 'Dust control and containment', items: ['Heavy-duty plastic containment for sanding', 'HEPA vacuum filtration for dust collection', 'Sealed work zones and covered HVAC vents', 'Air scrubbers available for extensive renovation'] },
  { title: 'Job site safety', items: ['Workers trained in OSHA safety standards', 'Ladder safety and fall protection', 'Electrical safety around outlets and fixtures', 'Chemical storage and handling per regulations'] },
  { title: 'Waste disposal', items: ['Paint waste disposed of per Texas regulations', 'Paint recycling when available', 'Responsible disposal of contaminated materials', 'Drop cloths and materials cleaned and reused'] },
  { title: 'Occupant safety during work', items: ['Work zones clearly marked and secured', 'Ventilation maintained during painting', 'Pet and child safety discussed before the project', 'After-hours work available to minimize disruption'] },
];
const terms = [
  { term: 'VOCs', def: 'Volatile organic compounds are chemicals that evaporate from paint and can affect indoor air quality. Low-VOC paints contain fewer of them.' },
  { term: 'EPA RRP', def: 'The Renovation, Repair and Painting rule requires special training for working safely around lead-based paint in homes built before 1978.' },
  { term: 'HEPA filtration', def: 'High-efficiency particulate air filters capture 99.97% of dust particles, keeping air cleaner during and after sanding.' },
];

export default function SafetyPage() {
  return (
    <main id="main-content">
      <section className="page-hero"><div className="container narrow">
        <p className="eyebrow">Safety &amp; environment</p>
        <h1>Environmental and safety practices</h1>
        <p>We follow EPA, OSHA and Texas regulations to protect your family, our workers and the environment.</p>
      </div></section>
      <section className="section"><div className="container reading-content">
        <div className="fact-list">{sections.map((s) => <div className="fact-card" key={s.title}><h2>{s.title}</h2><ul>{s.items.map((i) => <li key={i}>{i}</li>)}</ul></div>)}</div>
        <h2>Key terms</h2>
        <dl>{terms.map((t) => <div key={t.term}><dt><strong>{t.term}</strong></dt><dd>{t.def}</dd></div>)}</dl>
        <p>Ask about eco-friendly options and safety protocols during your free estimate. See our <Link href="/licensing-and-insurance">licensing and insurance</Link> details.</p>
      </div></section>
      <div className="container"><Callout title="Questions about paint or safety?" /></div>
    </main>
  );
}
