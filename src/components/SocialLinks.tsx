import { googleMapsUrl, socialLinks } from '../data/business';

export function SocialLinks({ className = 'social-links' }: { className?: string }) {
  const links = [...socialLinks, { label: 'Google Maps', href: googleMapsUrl }];
  return (
    <ul className={className} aria-label="INRI Paint & Wall on social media and directories">
      {links.map((l) => (
        <li key={l.label}><a href={l.href} target="_blank" rel="noopener noreferrer me">{l.label}<span className="visually-hidden"> (opens in a new tab)</span></a></li>
      ))}
    </ul>
  );
}
