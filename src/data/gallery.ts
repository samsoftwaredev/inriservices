/** Project photos from the existing inripaintwall.com "What We Can Do for You" section. */
export type GalleryImage = { src: string; width: number; height: number; alt: string };
const L = (n: number, alt: string): GalleryImage => ({ src: `/work/project-${String(n).padStart(2, '0')}.jpg`, width: 1024, height: 768, alt });
const P = (n: number, alt: string): GalleryImage => ({ src: `/work/project-${String(n).padStart(2, '0')}.jpg`, width: 768, height: 1024, alt });

export const gallery: readonly GalleryImage[] = [
  L(4, 'Finished living room with mint green paneled walls, white fireplace surround and white painted cabinets'),
  L(3, 'Mint green walls with crisp white trim, mantel and cabinets after painting'),
  P(18, 'Bathroom with light blue walls and a freshly painted white paneled door'),
  L(1, 'Built-in cabinets and fireplace painted white with floors and furniture covered for protection'),
  L(11, 'Completed room with mint green paneled walls, white trim and new wood-look flooring'),
  P(16, 'Laundry area with blue walls and freshly painted white cabinet doors'),
  L(9, 'Mint green wall panels outlined in white trim with glass-panel doors'),
  L(2, 'White cabinets and fireplace in the middle of a repaint with furniture wrapped in plastic'),
  P(17, 'Painter-taped door frame and mirror in a bathroom ready for painting'),
  L(8, 'Mint green walls and paneled white double closet doors'),
  L(5, 'Wall panel trim being filled and prepped before painting'),
  P(14, 'Drywall repair and ceiling patch in a utility room before finishing'),
  L(7, 'Freshly painted white wall panels and double doors in a finished room'),
  L(10, 'Room with green paneled walls and covered furniture while painting is in progress'),
  P(15, 'Newly hung and finished drywall in a laundry room with cabinets ready to paint'),
  L(6, 'Prepped wall panels and ceiling in a room with furniture protected by plastic'),
  P(13, 'Opened ceiling and wall during repair work above painted cabinets'),
  P(12, 'Exposed ceiling framing before new drywall in a room with painted trim'),
];
