import { bundleOffer, patchPackages } from '../data/offers';
import { paymentMethods } from '../data/business';
import { RevealGroup } from './RevealGroup';

export function PricingPackages() {
  return (
    <>
      <RevealGroup className="package-grid">
        {patchPackages.map((p) => (
          <article key={p.name} className="package-card">
            <p className="package-size">{p.name} · {p.size}</p>
            <p className="package-price">{p.price}</p>
            <p>{p.blurb}</p>
          </article>
        ))}
      </RevealGroup>
      <p className="package-bundle"><strong>{bundleOffer.title}: only {bundleOffer.price}!</strong></p>
      <p className="package-note">Prices cover typical drywall patch repairs. Final pricing depends on the surface and scope, so send a photo or description for a confirmed estimate.</p>
      <p className="payment-note">We accept {paymentMethods.join(', ')}.</p>
    </>
  );
}
