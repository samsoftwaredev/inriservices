export type Faq = { question: string; answer: string };
export type Service = {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  description: string;
  details: string;
  tasks: readonly string[];
  process: readonly string[];
  questions: readonly Faq[];
  icon: string;
};

/** Genuine offered services and general process. No invented jobs, reviews, or prices. */
export const services: readonly Service[] = [
  {
    slug: 'interior-painting', title: 'Interior House Painting in Garland, TX', shortTitle: 'Interior Painting', icon: '🏠',
    summary: 'Walls, ceilings, trim and room repainting with careful preparation and a clean finish.',
    description: 'Refresh an individual room or several interior spaces with painting that prioritizes preparation, protected surfaces and clear project communication.',
    details: 'Interior work starts with understanding which walls, ceilings, doors or trim you want painted. Surface conditions, existing coatings, repair needs and access determine the final scope and estimate.',
    tasks: ['Cover floors, furnishings and nearby fixtures', 'Fill small holes and repair surface imperfections as agreed', 'Sand, caulk and prime where needed', 'Apply specified finish coats and clean up the work area'],
    process: ['Walk through the rooms and discuss finishes', 'Review prep and repair requirements', 'Prepare and paint surfaces', 'Clean up and complete a final walkthrough'],
    questions: [
      { question: 'Do you repair wall damage before painting?', answer: 'Drywall patching, crack repairs and texture matching can be included in the project scope after a site review.' },
      { question: 'Can you paint only one room?', answer: 'Yes. Request an estimate for a single room, multiple rooms or a larger interior project.' },
    ],
  },
  {
    slug: 'exterior-painting', title: 'Exterior House Painting in Garland, TX', shortTitle: 'Exterior Painting', icon: '🏡',
    summary: 'Exterior painting, surface preparation, caulking and associated trim repairs.',
    description: 'Protect and refresh exterior surfaces with a project plan based on the existing siding, paint, weather exposure and preparation required.',
    details: 'Exterior painting quality depends on the condition of the surface underneath. We review peeling paint, failing caulk, exposed wood and weather before setting the work scope.',
    tasks: ['Inspect and prepare surfaces', 'Clean, scrape and sand as needed', 'Caulk gaps and spot-prime appropriate areas', 'Apply specified coatings and inspect the completed work'],
    process: ['Evaluate the exterior and identify repairs', 'Confirm surfaces and paint scope', 'Prepare and protect nearby areas', 'Paint and complete a walkthrough'],
    questions: [
      { question: 'Can you repair damaged exterior trim?', answer: 'Minor exterior wood and trim repairs can be discussed as a separate part of the estimate.' },
      { question: 'When is exterior painting scheduled?', answer: 'Exterior timing depends on site access and suitable weather for the selected coatings.' },
    ],
  },
  {
    slug: 'drywall-repair', title: 'Drywall Repair & Installation in Garland, TX', shortTitle: 'Drywall Repair', icon: '🧱',
    summary: 'Holes, cracks, damaged wall and ceiling sections, finishing and texture blending.',
    description: 'Repair visible wall or ceiling damage and prepare patched areas for a more consistent painted finish.',
    details: 'Drywall repair and installation both come down to the same things: a good result accounts for the damaged or missing material, joint finishing and how the patch blends with the surrounding wall or ceiling. Some repairs require multiple drying and finishing steps.',
    tasks: ['Inspect holes, cracks or affected areas', 'Patch or replace damaged drywall as appropriate', 'Apply joint compound, sand and blend texture', 'Spot-prime and paint where included in scope'],
    process: ['Assess the damage and any underlying cause', 'Agree on repair boundaries and finish', 'Repair, finish and texture the area', 'Prime or paint where specified'],
    questions: [
      { question: 'Can you match an existing wall texture?', answer: 'Texture matching is available, though an exact match depends on the existing surface, technique and age of the finish.' },
      { question: 'Do you handle ceiling cracks and patches?', answer: 'Yes. Ceiling drywall repair and finishing are among the services that can be estimated.' },
    ],
  },
  {
    slug: 'cabinet-painting', title: 'Kitchen Cabinet Painting in Garland, TX', shortTitle: 'Cabinet Painting', icon: '🎨',
    summary: 'Cabinet preparation, priming and painted finishes for kitchens and other cabinetry.',
    description: 'Update existing cabinetry through surface preparation and painting without assuming that cabinet replacement is necessary.',
    details: 'Cabinet finish quality depends on the substrate and previous coating. Degreasing, sanding, suitable primers and drying time are evaluated as part of the project.',
    tasks: ['Review existing cabinet material and condition', 'Remove hardware and protect surrounding areas as needed', 'Clean, sand and prime for adhesion', 'Apply the agreed coating system and reassemble as scoped'],
    process: ['Inspect cabinets and discuss desired finish', 'Confirm preparation and project scope', 'Prepare and coat the surfaces', 'Complete final checks and cleanup'],
    questions: [
      { question: 'Can existing kitchen cabinets be painted?', answer: 'Many existing cabinets can be painted. The surface material and current finish need to be checked first.' },
      { question: 'Is cabinet painting the same as wall painting?', answer: 'No. Cabinets usually require more detailed cleaning, surface preparation and an appropriate coating system.' },
    ],
  },
  {
    slug: 'popcorn-ceiling-removal', title: 'Popcorn Ceiling Removal & Repair in Garland, TX', shortTitle: 'Popcorn Ceilings', icon: '🔨',
    summary: 'Ceiling texture removal or patching, surface refinishing, priming and painting.',
    description: 'Discuss popcorn ceiling removal, patching or repainting with a plan suited to the age, condition and material of the ceiling.',
    details: 'Ceiling projects may involve scraping, repairing uneven areas, applying a new finish and painting. Older textured ceilings may require testing for asbestos before any disturbance.',
    tasks: ['Assess ceiling condition and any needed testing', 'Protect flooring and nearby furnishings', 'Remove or repair texture only where safe and agreed', 'Refinish, prime and paint surfaces as specified'],
    process: ['Inspect ceiling and discuss desired finish', 'Confirm safety requirements and project scope', 'Protect surfaces and complete authorized work', 'Clean and review the result'],
    questions: [
      { question: 'Can you patch a popcorn ceiling instead of removing all of it?', answer: 'Sometimes. The right approach depends on the damage, existing texture and desired finish.' },
      { question: 'Do older ceilings need special precautions?', answer: 'Yes. Some older textured materials may contain asbestos. Testing and appropriate professional handling may be necessary before disturbance.' },
    ],
  },
  {
    slug: 'trim-and-wood-repair', title: 'Trim, Caulking & Minor Wood Repairs in Garland, TX', shortTitle: 'Trim & Wood Repair', icon: '🪚',
    summary: 'Baseboards, crown molding, caulking and selected soffit, fascia or exterior trim repairs.',
    description: 'Address worn trim, gaps and limited wood damage as part of painting and finishing projects.',
    details: 'Trim repair and installation needs vary depending on moisture exposure, damage extent and the available material. We can evaluate small carpentry repairs when preparing an estimate.',
    tasks: ['Inspect trim and damaged wood', 'Confirm repair or replacement scope', 'Fill, sand and caulk where appropriate', 'Prime and paint repaired surfaces when included'],
    process: ['Inspect the problem areas', 'Agree on materials and repair scope', 'Repair or install trim', 'Finish and clean up'],
    questions: [
      { question: 'Can trim repairs be included with painting?', answer: 'Yes. Many painting projects include caulking, trim repairs or minor carpentry when identified during the estimate.' },
      { question: 'Do you fix all structural wood damage?', answer: 'No. Significant structural or hidden damage may need another qualified specialist.' },
    ],
  },
  {
    slug: 'wall-retexturing', title: 'Wall Retexturing in Garland, TX', shortTitle: 'Wall Retexturing', icon: '🖌️',
    summary: 'Updated wall textures for a smoother, more modern look.',
    description: 'Replace a dated or uneven wall texture with a finish that suits the room, applied after repairs and surface preparation.',
    details: 'Retexturing depends on what is on the wall now. We look at the existing texture, any patches or damage and the look you want before recommending a method, since the surface must be sound before a new texture goes on.',
    tasks: ['Review the existing texture and wall condition', 'Repair damage and prepare the surface', 'Apply the agreed texture and let it dry', 'Prime and paint the finished walls as specified'],
    process: ['Look at the walls and discuss the desired finish', 'Agree on texture style and preparation', 'Apply texture and allow proper drying', 'Prime, paint and clean up'],
    questions: [
      { question: 'Can walls be made smoother?', answer: 'Often, yes. How much smoothing is practical depends on the current texture, so we assess the walls before recommending an approach.' },
      { question: 'Do you paint after retexturing?', answer: 'Yes. Retexturing is commonly paired with priming and painting so the room is finished in one project.' },
    ],
  },
  {
    slug: 'wallpaper-removal', title: 'Wallpaper Removal in Garland, TX', shortTitle: 'Wallpaper Removal', icon: '🧹',
    summary: 'Remove outdated wallpaper and prepare the walls for a new look.',
    description: 'Strip old wallpaper and adhesive, repair the wall beneath and prepare it for paint or a new finish.',
    details: 'Wallpaper can leave adhesive residue or damage the wall surface when it comes off. We check how the paper is attached, remove it and the glue, and repair the wall so the next finish goes on evenly.',
    tasks: ['Protect floors, trim and nearby surfaces', 'Remove wallpaper and adhesive residue', 'Repair surface damage left behind', 'Prime and paint or prepare for the next finish'],
    process: ['Inspect the wallpaper and wall condition', 'Confirm removal and repair scope', 'Remove paper and clean the walls', 'Repair, prime and finish'],
    questions: [
      { question: 'Will removing wallpaper damage my walls?', answer: 'It can, particularly if the paper was applied directly to unprimed drywall. We repair any damage as part of preparing the walls for paint.' },
      { question: 'Can you paint the walls after the wallpaper is gone?', answer: 'Yes. Removal, wall repair, priming and painting can be estimated together.' },
    ],
  },
  {
    slug: 'deck-and-fence-staining', title: 'Deck & Fence Staining and Sealing in Garland, TX', shortTitle: 'Deck & Fence Staining', icon: '🌞',
    summary: 'Clean, stain and seal decks and fences to protect and refresh the wood.',
    description: 'Protect and beautify outdoor wood with cleaning, staining and sealing suited to the surface and its exposure.',
    details: 'Outdoor wood takes sun, rain and heat all year. The existing finish, the age of the wood and how much weathering has occurred decide how much cleaning and preparation is needed before stain and sealer go on.',
    tasks: ['Inspect the wood and any previous finish', 'Clean the surface and let it dry', 'Sand or prepare rough areas as needed', 'Apply stain and sealer for an even finish'],
    process: ['Review the deck or fence and discuss the finish', 'Confirm preparation and product choice', 'Clean, prepare and stain', 'Seal and review the completed work'],
    questions: [
      { question: 'Can you stain an old fence?', answer: 'Yes. Weathered fences can usually be cleaned and re-stained, and the result depends on the condition of the wood.' },
      { question: 'Is cleaning needed before staining?', answer: 'Yes. Dirt and old finish prevent stain from absorbing evenly, so cleaning and drying come first.' },
    ],
  },
  {
    slug: 'pressure-washing', title: 'Pressure Washing in Garland, TX', shortTitle: 'Pressure Washing', icon: '💦',
    summary: 'Clean and restore exterior surfaces with controlled pressure washing.',
    description: 'Remove built-up dirt, algae and grime from exterior surfaces to restore their appearance or prepare them for painting or staining.',
    details: 'Pressure washing cleans exterior surfaces and is often the first step before painting or staining. The right pressure and method depend on the material so cleaning does not damage it.',
    tasks: ['Identify the surfaces to be cleaned', 'Protect plants, fixtures and openings', 'Wash with pressure suited to each material', 'Allow surfaces to dry before any coating'],
    process: ['Review the surfaces and discuss goals', 'Confirm scope and access', 'Wash the agreed areas', 'Inspect results and move to any follow-up painting or staining'],
    questions: [
      { question: 'Do you pressure wash before painting?', answer: 'Cleaning is a common first step for exterior painting so new coatings bond to a clean surface.' },
      { question: 'Can pressure washing damage siding or wood?', answer: 'Too much pressure can. The method and pressure are matched to the material.' },
    ],
  },
] as const;

export const serviceSlugs = services.map((service) => service.slug);
export function getService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
