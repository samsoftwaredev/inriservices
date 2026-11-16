import Image from 'next/image';
import { beforeAfter } from '../data/gallery';
import { RevealGroup } from './RevealGroup';

export function BeforeAfter() {
  return (
    <RevealGroup className="compare-grid">
      {beforeAfter.map((item) => (
        <figure key={item.src} className="compare-card">
          <Image src={item.src} alt={item.alt} width={900} height={1200} sizes="(min-width: 960px) 360px, (min-width: 600px) 45vw, 92vw" />
          <figcaption>{item.caption}</figcaption>
        </figure>
      ))}
    </RevealGroup>
  );
}
