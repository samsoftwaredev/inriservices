import { reviews } from '../data/offers';
import { RevealGroup } from './RevealGroup';

export function Reviews() {
  return (
    <RevealGroup className="review-grid">
      {reviews.map((r) => (
        <figure key={r.name} className="review-card">
          <blockquote><p>“{r.text}”</p></blockquote>
          <figcaption><strong>{r.name}</strong><span>{r.source}</span></figcaption>
        </figure>
      ))}
    </RevealGroup>
  );
}
