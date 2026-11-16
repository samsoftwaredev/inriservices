import { RevealGroup } from './RevealGroup';

export function SectionHeading({ eyebrow, title, description, reveal = false }: { eyebrow?: string; title: string; description?: string; reveal?: boolean }) {
  const content = <>
    {eyebrow && <p className="eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
    {description && <p className="section-intro">{description}</p>}
  </>;
  return reveal
    ? <RevealGroup className="section-heading" columns={3}>{content}</RevealGroup>
    : <div className="section-heading">{content}</div>;
}
