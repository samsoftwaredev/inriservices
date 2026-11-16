import Image from 'next/image';
import { gallery } from '../data/gallery';
import { RevealGroup } from './RevealGroup';

export function ProjectGallery() {
  return (
    <RevealGroup className="gallery">
      {gallery.map((img) => (
        <figure key={img.src} className="gallery-item">
          <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(min-width: 960px) 360px, (min-width: 600px) 45vw, 92vw" />
        </figure>
      ))}
    </RevealGroup>
  );
}
