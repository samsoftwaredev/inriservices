import { reviews } from '../data/offers';
import { googleMapsUrl, googleReviewUrl, socialLinks } from '../data/business';
import { RevealGroup } from './RevealGroup';

export function Reviews() {
  return (
    <>
    <RevealGroup className="review-grid">
      {reviews.map((r) => (
        <figure key={r.name} className="review-card">
          <blockquote><p>“{r.text}”</p></blockquote>
          <figcaption><strong>{r.name}</strong><span>{r.source}</span></figcaption>
        </figure>
      ))}
    </RevealGroup>
      <p className="rating-link">
        <a className="button outline" href={googleMapsUrl} target="_blank" rel="noopener noreferrer">Read all reviews on Google<span className="visually-hidden"> (opens in a new tab)</span></a>
        <a className="button outline" href={socialLinks.find((l) => l.label === 'Yelp')?.href} target="_blank" rel="noopener noreferrer">See us on Yelp<span className="visually-hidden"> (opens in a new tab)</span></a>
        {googleReviewUrl && <a className="button primary" href={googleReviewUrl} target="_blank" rel="noopener noreferrer">Leave us a review<span className="visually-hidden"> (opens in a new tab)</span></a>}
      </p>
    </>
  );
}
