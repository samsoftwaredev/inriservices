import Link from 'next/link';
import { SocialLinks } from './SocialLinks';
import { business, hours, navLinks } from '../data/business';
import { areas, areaPath } from '../data/areas';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="footer-brand">INRI Paint &amp; Wall LLC</p>
          <p>Painting, drywall repair and surface finishing for Garland and nearby Dallas-area communities.</p>
        </div>
        <nav aria-label="Footer navigation"><p className="footer-head">Explore</p>{navLinks.map(item=><Link key={item.href} href={item.href}>{item.label}</Link>)}<Link href="/pricing-and-estimates">Estimates &amp; Pricing</Link><Link href="/licensing-and-insurance">Licensing &amp; Insurance</Link><Link href="/environmental-and-safety-practices">Safety &amp; Environment</Link></nav>
        <nav aria-label="Service areas"><p className="footer-head">Service areas</p>{areas.map(a=><Link key={a.slug} href={areaPath(a.slug)}>{a.name}, TX</Link>)}</nav>
        <div><p className="footer-head">Get in touch</p><a href={`tel:${business.phone}`}>{business.phoneDisplay}</a><a href={`mailto:${business.email}`}>{business.email}</a><p>{hours.display}<br />{hours.closed}</p><p className="footer-head">Follow us</p><SocialLinks /></div>
      </div>
      <div className="container footer-bottom">© {new Date().getFullYear()} {business.name}. All rights reserved.</div>
    </footer>
  );
}
