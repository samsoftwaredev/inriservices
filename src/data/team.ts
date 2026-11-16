/**
 * Real crew photos supplied by the owner, optimized from public/workers into public/team.
 * One photo had a customer's house number blurred. Captions describe only what is visible.
 */
export type CrewPhoto = { key: string; src: string; width: number; height: number; alt: string; caption: string };

export const crewPhotos: readonly CrewPhoto[] = [
  { key: 'garage-team', src: '/team/crew-garage-team.jpg', width: 1400, height: 1050, alt: 'Two INRI Paint & Wall crew members in branded shirts working inside a garage during a drywall repair job', caption: 'The crew on a garage drywall repair job' },
  { key: 'door-sanding', src: '/team/crew-door-sanding.jpg', width: 825, height: 1100, alt: 'INRI Paint & Wall painter in a branded shirt sanding a wood entry door with painter tape around the frame', caption: 'Sanding and prepping a wood door before refinishing' },
  { key: 'drywall-patching', src: '/team/crew-drywall-patching.jpg', width: 1100, height: 825, alt: 'INRI Paint & Wall team member kneeling in a garage with a mud pan, applying joint compound to patch drywall', caption: 'Applying joint compound for a drywall patch' },
  { key: 'home-exterior', src: '/team/crew-home-exterior.jpg', width: 1400, height: 1050, alt: 'INRI Paint & Wall team member with a clipboard evaluating the exterior of a two-story brick and stucco home', caption: 'Evaluating a home exterior on site' },
  { key: 'lunch-break', src: '/team/crew-lunch-break.jpg', width: 1400, height: 1050, alt: 'Three INRI Paint & Wall crew members in branded shirts having lunch in folding chairs on a front lawn', caption: 'Lunch break with the crew' },
] as const;

export const crewPhoto = (key: string): CrewPhoto => {
  const p = crewPhotos.find((c) => c.key === key);
  if (!p) throw new Error(`Unknown crew photo: ${key}`);
  return p;
};

/** Service pages that show a photo of the crew doing that kind of work. */
export const servicePhotoKeys: Readonly<Record<string, string>> = {
  'drywall-repair': 'drywall-patching',
  'trim-and-wood-repair': 'door-sanding',
  'exterior-painting': 'home-exterior',
};
