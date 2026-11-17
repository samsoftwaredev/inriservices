import Link from 'next/link';
import { RevealGroup } from './RevealGroup';
import { CrewFigure } from './CrewFigure';

/** "Meet the crew" block for the home page. Copy follows the owner's existing site wording. */
export function TeamSection() {
  return (
    <section className="section" id="team" aria-label="Meet the crew"><div className="container team-grid">
      <div className="team-copy">
        <p className="eyebrow">Family owned &amp; operated</p>
        <h2>Meet the crew who will be in your home</h2>
        <p>We are more than painters. We are homeowners too, which is why we treat every project with the care and respect it deserves. Our team is made up of skilled professionals who put cleanliness and quality first.</p>
        <Link className="text-link" href="/about">More about our team <span aria-hidden="true">→</span></Link>
      </div>
      <RevealGroup className="team-photos" columns={2}>
        <CrewFigure photoKey="garage-team" className="crew-figure team-main" sizes="(min-width: 960px) 560px, 92vw" />
        <CrewFigure photoKey="door-sanding" sizes="(min-width: 960px) 270px, 45vw" />
        <CrewFigure photoKey="drywall-patching" sizes="(min-width: 960px) 270px, 45vw" />
      </RevealGroup>
    </div></section>
  );
}
