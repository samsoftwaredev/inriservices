import Image from 'next/image';
import { crewPhoto } from '../data/team';

export function CrewFigure({ photoKey, sizes = '(min-width: 960px) 520px, 92vw', className = 'crew-figure', priority = false }: { photoKey: string; sizes?: string; className?: string; priority?: boolean }) {
  const p = crewPhoto(photoKey);
  return (
    <figure className={className}>
      <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes={sizes} priority={priority} />
      <figcaption>{p.caption}</figcaption>
    </figure>
  );
}
