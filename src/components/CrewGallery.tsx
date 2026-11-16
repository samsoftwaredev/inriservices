import { crewPhotos } from '../data/team';
import { CrewFigure } from './CrewFigure';
import { RevealGroup } from './RevealGroup';

export function CrewGallery() {
  return (
    <RevealGroup className="gallery crew-gallery">
      {crewPhotos.map((p) => <CrewFigure key={p.key} photoKey={p.key} className="crew-figure gallery-item" sizes="(min-width: 960px) 360px, (min-width: 600px) 45vw, 92vw" />)}
    </RevealGroup>
  );
}
