import type { Faq } from './services';

/**
 * Community landing pages.
 *
 * Google's spam policies treat near-identical city pages ("doorway pages") as a
 * problem, so every entry below is written to stand on its own: different housing
 * context, different common projects and different questions. Only general,
 * verifiable local context is used. No invented projects, reviews, addresses,
 * distances or customer claims. tests/areas.test.ts guards uniqueness.
 */
export type AreaNeed = { title: string; text: string; serviceSlug: string };

export type Area = {
  slug: string;
  name: string;
  /** Short sentence used on the hub page and in nearby-city links. */
  summary: string;
  /** <title> text without the site suffix. Keep under ~40 characters. */
  metaTitle: string;
  /** 120–160 characters. */
  metaDescription: string;
  lead: string;
  contextHeading: string;
  context: readonly string[];
  needsHeading: string;
  needs: readonly AreaNeed[];
  goodToKnowHeading: string;
  goodToKnow: string;
  nearby: readonly string[];
  questions: readonly Faq[];
};

export const areas: readonly Area[] = [
  {
    slug: 'garland',
    name: 'Garland',
    summary: 'Our home base. Painting, drywall repair and finishing for established Garland homes.',
    metaTitle: 'Painting & Drywall in Garland, TX',
    metaDescription: 'Garland-based painters for interior and exterior painting, drywall repair, cabinet painting and ceiling work. Call INRI Paint & Wall for an estimate.',
    lead: 'INRI Paint & Wall is based in Garland, so this is the community we know best. We handle painting, drywall repair and finish work for homes across the city.',
    contextHeading: 'Painting established Garland homes',
    context: [
      'Garland grew steadily through the second half of the last century, which means many neighborhoods are made up of homes that are several decades old. Houses of that age tend to have layers of previous paint, worn caulk lines, small repairs from past owners and ceiling textures that were popular at the time.',
      'That history shapes how we scope a job here. Before recommending a finish we look at what is already on the surface, how well it is bonded and which repairs need to happen first, so the new paint is not sitting on top of problems that will show through again.',
    ],
    needsHeading: 'What Garland homeowners often ask us about',
    needs: [
      { title: 'Textured and popcorn ceilings', text: 'Dated ceiling texture is one of the most common requests we hear. Removal, patching and repainting are all options depending on the ceiling.', serviceSlug: 'popcorn-ceiling-removal' },
      { title: 'Hairline wall and ceiling cracks', text: 'North Texas clay soil moves with the seasons, and small cracks above doors and along ceilings are a familiar result. We repair and blend them before painting.', serviceSlug: 'drywall-repair' },
      { title: 'Tired exterior trim and caulk', text: 'Peeling fascia, open caulk joints and faded trim let moisture in. Re-caulking and repainting protects the wood underneath.', serviceSlug: 'exterior-painting' },
      { title: 'Dated kitchen cabinets', text: 'Solid cabinet boxes in good shape can often be refinished instead of replaced.', serviceSlug: 'cabinet-painting' },
    ],
    goodToKnowHeading: 'Before disturbing an older ceiling',
    goodToKnow: 'Textured ceilings in homes built before the 1980s can contain asbestos. If your Garland home is that age, have the material tested before anyone scrapes or sands it. We will tell you when testing is worth doing before we quote removal.',
    nearby: ['rowlett', 'mesquite', 'richardson'],
    questions: [
      { question: 'Are you actually located in Garland?', answer: 'Yes. INRI Paint & Wall is based in Garland, Texas, and Garland is where we do most of our estimating and scheduling.' },
      { question: 'Can you work on an older Garland home with several coats of old paint?', answer: 'Yes. Older homes just need a closer look at surface condition during the estimate so the preparation matches what is actually on the walls and trim.' },
    ],
  },
  {
    slug: 'plano',
    name: 'Plano',
    summary: 'Interior refreshes, exterior repaints and cabinet updates, including HOA neighborhoods.',
    metaTitle: 'Painting & Drywall in Plano, TX',
    metaDescription: 'Interior and exterior painting, cabinet painting and drywall repair for Plano homes, including HOA neighborhoods. Contact INRI Paint & Wall for an estimate.',
    lead: 'We take painting and drywall repair projects in Plano, from single-room refreshes to full exterior repaints in neighborhoods with association guidelines.',
    contextHeading: 'Painting in Plano neighborhoods with HOA guidelines',
    context: [
      'Much of Plano was built out from the 1970s onward, and a large share of its neighborhoods have homeowners associations. For a painting project that usually means two things: exterior colors may need approval, and the house has probably been repainted at least once by a previous owner.',
      'Our part is practical. Once you know which colors and finishes are allowed, we scope the preparation, the repairs and the number of coats, and give you an estimate you can attach to an association request if one is required.',
    ],
    needsHeading: 'Projects we hear about from Plano homeowners',
    needs: [
      { title: 'Exterior repaints with approved colors', text: 'Two-story fronts, garage doors, shutters and trim are the usual scope when an association has signed off on a palette.', serviceSlug: 'exterior-painting' },
      { title: 'Oak cabinets from the 1990s', text: 'Honey-oak kitchens are a common reason people call. Cleaning, sanding, priming and a durable coating can change the room without a remodel.', serviceSlug: 'cabinet-painting' },
      { title: 'Whole-house interior color changes', text: 'Moving from builder beige to a new palette across living areas, halls and bedrooms, with repairs handled before painting starts.', serviceSlug: 'interior-painting' },
      { title: 'Soffits and fascia at height', text: 'Higher trim takes the most sun and weather. We look for rot, open joints and failing paint before recommending a repair.', serviceSlug: 'trim-and-wood-repair' },
    ],
    goodToKnowHeading: 'Start HOA approvals early',
    goodToKnow: 'Review times for architectural requests vary by association. If your Plano neighborhood requires approval for exterior colors, submit the request before you book painting dates so the schedule is not held up waiting on a decision.',
    nearby: ['richardson', 'dallas', 'rowlett'],
    questions: [
      { question: 'Do I need HOA approval before repainting my Plano exterior?', answer: 'Often, yes. Many Plano associations review exterior color changes. Check your association guidelines first. We can help describe the scope and finishes once the colors are approved.' },
      { question: 'Can you paint just the front of the house or the garage door?', answer: 'Partial exterior projects can be estimated. Matching existing colors and blending into weathered paint is part of what we review on site.' },
    ],
  },
  {
    slug: 'richardson',
    name: 'Richardson',
    summary: 'Mid-century neighborhoods: ceilings, older walls, doors, trim and painted brick.',
    metaTitle: 'Painting & Drywall in Richardson, TX',
    metaDescription: 'Painting, drywall repair and ceiling work for established Richardson homes. Interior, exterior and trim projects. Call INRI Paint & Wall for an estimate.',
    lead: 'We work with Richardson homeowners on painting, drywall repair and trim projects, with a lot of attention to what is already on older walls and ceilings.',
    contextHeading: 'Painting mid-century Richardson homes',
    context: [
      'Richardson has many established neighborhoods with homes built around the middle of the last century. Single-story layouts, wide roof overhangs and brick exteriors with painted trim are common, and so are interiors that have been updated one room at a time over many years.',
      'Those updates are why walls in older homes can be uneven. A room may have an old addition, a patched section where a wall was moved or several generations of texture. We plan repairs around that instead of painting over it and hoping for the best.',
    ],
    needsHeading: 'Common Richardson project types',
    needs: [
      { title: 'Doors, casings and baseboards with heavy paint buildup', text: 'Years of coats soften crisp profiles. Scraping, sanding, filling and priming brings them back before new paint goes on.', serviceSlug: 'trim-and-wood-repair' },
      { title: 'Mismatched wall texture after past repairs', text: 'Patches from old projects often show under fresh paint. We blend texture so the repaired area stops standing out.', serviceSlug: 'drywall-repair' },
      { title: 'Painted eaves, fascia and window trim', text: 'On brick homes the painted trim does most of the weather protection. Keeping it sealed matters more than the color.', serviceSlug: 'exterior-painting' },
      { title: 'Room-by-room interior updates', text: 'Many owners refresh one area at a time. We can scope a single room or build a plan across several.', serviceSlug: 'interior-painting' },
    ],
    goodToKnowHeading: "Tell us your home's age",
    goodToKnow: 'Paint applied to homes built before 1978 may contain lead, and federal rules apply to work that disturbs it. When you contact us about a Richardson home from that era, mention the build year so we can plan preparation and discuss precautions before any sanding or scraping.',
    nearby: ['plano', 'garland', 'dallas'],
    questions: [
      { question: 'Can you fix wall patches from earlier remodels before painting?', answer: 'Yes. Drywall patching and texture blending are part of our work, and we review how visible the old repairs are during the estimate.' },
      { question: 'Should painted brick trim be repainted or just caulked?', answer: 'It depends on how much paint is failing. Sound paint with open caulk joints may only need re-caulking and touch-up, while peeling areas need scraping and priming first.' },
    ],
  },
  {
    slug: 'rockwall',
    name: 'Rockwall',
    summary: 'Newer homes: settling cracks, nail pops and scuffed builder paint, plus larger open spaces.',
    metaTitle: 'Painting & Drywall in Rockwall, TX',
    metaDescription: 'Painting and drywall repair for Rockwall homes: settling cracks, nail pops, interior repaints and exteriors. Call INRI Paint & Wall for an estimate.',
    lead: 'We handle painting and drywall repair for Rockwall homes, including newer houses that are showing their first settling cracks and scuffed builder paint.',
    contextHeading: 'Newer construction and lakeside living in Rockwall',
    context: [
      'Rockwall has seen a lot of new construction, and many homes sit near Lake Ray Hubbard. Newer houses come with their own kind of wear. Builder-grade flat paint scuffs easily, and the first few years after construction are when drywall tends to show nail pops and thin cracks as the structure and soil settle.',
      'Open floor plans and tall living areas are also common in newer homes. Tall walls, stairwells and two-story entries change how a job is set up, so we plan for access and equipment when we estimate rather than treating it as a surprise.',
    ],
    needsHeading: 'What Rockwall homeowners tend to need',
    needs: [
      { title: 'Nail pops and settling cracks', text: 'Small fastener pops and hairline cracks are routine in newer homes. We repair them cleanly and repaint the area so the fix disappears.', serviceSlug: 'drywall-repair' },
      { title: 'Repainting scuffed builder paint', text: "Switching to a more washable finish in hallways, kids' rooms and kitchens is a popular upgrade.", serviceSlug: 'interior-painting' },
      { title: 'Tall walls and two-story entries', text: 'High walls take planning. We scope the access equipment and the prep for them up front.', serviceSlug: 'interior-painting' },
      { title: 'Exterior repaints that handle sun and wind', text: 'Open lots and lake-adjacent exposure are hard on exterior coatings. We check for chalking, peeling and open caulk before choosing a plan.', serviceSlug: 'exterior-painting' },
    ],
    goodToKnowHeading: 'Check your builder warranty first',
    goodToKnow: 'Some builders include a warranty period that covers certain drywall issues in new homes. If your Rockwall house is recent, ask what is covered before paying for repairs, then call us for anything that falls outside it or for the repainting afterward.',
    nearby: ['rowlett', 'garland', 'mesquite'],
    questions: [
      { question: 'Why are cracks appearing in my newer Rockwall home?', answer: 'Minor cracks and nail pops are common as a new house settles and as the seasons change the soil around it. We repair the visible damage. Large or growing cracks may need a different specialist to assess.' },
      { question: 'Can you paint tall entry walls?', answer: 'Yes. High walls and stairwells are scoped with access equipment in mind during the estimate.' },
    ],
  },
  {
    slug: 'rowlett',
    name: 'Rowlett',
    summary: 'Exterior upkeep for homes exposed to lake-area sun, wind and moisture.',
    metaTitle: 'Painting & Drywall in Rowlett, TX',
    metaDescription: 'Exterior painting, trim and wood repair, plus interior painting and drywall work in Rowlett, TX. Call INRI Paint & Wall for an estimate.',
    lead: 'Rowlett projects often start outside, with trim, fascia and siding that take a beating from sun, wind and humidity. We also handle the interior work that goes with it.',
    contextHeading: 'Exterior upkeep near Lake Ray Hubbard',
    context: [
      'Rowlett sits on the shore of Lake Ray Hubbard, and many neighborhoods were developed over the last several decades. Homes here get strong sun, open wind and humid stretches, and exterior wood is usually the first thing to show it.',
      'Trim is where we start. Fascia boards, soffits and window casings fail from the edges, with open caulk lines, hairline paint cracks and soft wood. Catching them early keeps a repaint from turning into carpentry.',
      'Interior projects in Rowlett often follow the exterior work. Once the outside is sealed and protected, many owners turn to repainting rooms that have faded from sunlit windows, or to repairing ceiling and wall stains that appeared after a roof or plumbing leak was fixed.',
    ],
    needsHeading: 'Typical Rowlett projects',
    needs: [
      { title: 'Fascia, soffit and window trim repair', text: 'Rot is more likely where water sits. We inspect, replace or repair small sections and prime before painting.', serviceSlug: 'trim-and-wood-repair' },
      { title: 'Full exterior repaints', text: 'Siding and brick-and-trim combinations get scraped, caulked, primed and coated for the exposure they face.', serviceSlug: 'exterior-painting' },
      { title: 'Garage and entry door refreshes', text: 'Doors facing the afternoon sun fade and peel first. A repaint is a smaller job with a visible payoff.', serviceSlug: 'exterior-painting' },
      { title: 'Interior repaints after leaks or stains', text: 'Water stains on ceilings and walls get repaired and sealed before paint so they do not bleed back through.', serviceSlug: 'drywall-repair' },
    ],
    goodToKnowHeading: 'Timing an exterior job in North Texas weather',
    goodToKnow: 'Spring and fall usually offer the mildest conditions for exterior coatings. Paint labels list temperature and weather limits, and we schedule around them. Midday summer heat can make paint dry too fast and rain forces delays, so a flexible start date helps.',
    nearby: ['garland', 'rockwall', 'mesquite'],
    questions: [
      { question: 'Do you repair rotted trim before painting?', answer: 'Minor exterior wood and trim repairs can be included in the estimate. Extensive or structural rot may need a carpenter or other specialist.' },
      { question: 'What is the best time of year to paint a Rowlett exterior?', answer: 'Mild, dry stretches in spring and fall are typically best. We schedule around the weather limits of the coatings used.' },
    ],
  },
  {
    slug: 'mesquite',
    name: 'Mesquite',
    summary: 'Practical updates for established homes: trim, ceilings, wall damage and repaints.',
    metaTitle: 'Painting & Drywall in Mesquite, TX',
    metaDescription: 'Painting, trim repair, drywall patching and ceiling work for Mesquite, TX homes. Call INRI Paint & Wall for an estimate on your project.',
    lead: 'We take on painting, trim repair and drywall projects in Mesquite, with a practical focus on getting worn rooms and exteriors back into good shape.',
    contextHeading: 'Practical updates for established Mesquite homes',
    context: [
      'Mesquite has many established neighborhoods where homes have been lived in for decades, often with a mix of brick, siding and wood trim. Wear is cumulative: baseboards take kicks, doors collect dents, and ceilings and walls pick up the marks of ordinary use.',
      'Because of that, a lot of Mesquite work is repair-first. We fix the damage that is actually there, then paint so the room looks consistent instead of looking freshly painted over a worn surface.',
      'We also keep the scope flexible. Some Mesquite owners only want the worst rooms handled this year and the rest later, and a clear room-by-room estimate makes that easy to plan without redoing prep work twice.',
    ],
    needsHeading: 'What we are most often asked about in Mesquite',
    needs: [
      { title: 'Door-handle holes and wall dings', text: 'Small holes are inexpensive to repair properly, and they stand out dramatically if only painted over.', serviceSlug: 'drywall-repair' },
      { title: 'Worn baseboards and casings', text: 'Replacing or repairing damaged trim, then caulking and painting it, makes a room look newer than the paint alone.', serviceSlug: 'trim-and-wood-repair' },
      { title: 'Dated ceiling texture', text: 'Popcorn ceilings can be patched, removed or repainted. The right option depends on what is up there.', serviceSlug: 'popcorn-ceiling-removal' },
      { title: 'Between-tenant or pre-listing repaints', text: 'Landlords and sellers often want a clean, consistent repaint. We can scope a few rooms or the whole interior.', serviceSlug: 'interior-painting' },
    ],
    goodToKnowHeading: 'Repair before color',
    goodToKnow: 'Ordering matters. Wall repairs, texture and trim work should be done before color is chosen and applied, because patches can change how a finish reads under light. When you request an estimate, list the damage along with the rooms you want painted.',
    nearby: ['garland', 'rowlett', 'dallas'],
    questions: [
      { question: 'Can you repair damaged baseboards and also paint them?', answer: 'Yes. Trim repair, caulking and painting are commonly combined in one project.' },
      { question: 'Do you repaint rental homes?', answer: 'We can estimate repaints and repairs for rental or pre-sale properties. Tell us the scope and timing when you contact us.' },
    ],
  },
  {
    slug: 'dallas',
    name: 'Dallas',
    summary: 'Painting and repair in the Dallas neighborhoods nearest Garland, including older homes.',
    metaTitle: 'Painting & Drywall in Dallas, TX',
    metaDescription: 'Interior and exterior painting and drywall repair in East and Northeast Dallas neighborhoods near Garland. Call INRI Paint & Wall for an estimate.',
    lead: 'We work in the Dallas neighborhoods closest to our Garland base. Share your address when you call and we will confirm whether the project is within our service area.',
    contextHeading: 'Painting in East and Northeast Dallas',
    context: [
      'Dallas is large and its housing is varied, from small mid-century ranch homes to older bungalows and newer infill. Our work is concentrated in the parts of the city nearest Garland, and we confirm location before scheduling an estimate.',
      'Older Dallas houses can come with surprises: plaster or heavily patched walls, many coats of old paint and additions that do not match the original rooms. Each affects the prep list, so we like to see the property before we put a number on it.',
      'If you are not sure whether your address falls inside our range, just ask. A quick call or email with the street and the type of work is usually enough for us to say whether we can take the project.',
    ],
    needsHeading: 'Dallas projects we can help with',
    needs: [
      { title: 'Older bungalow and ranch interiors', text: 'Cracked plaster, uneven walls and thick old paint need patient prep. We repair and prime before applying new finishes.', serviceSlug: 'interior-painting' },
      { title: 'Exterior repaints and trim', text: 'Wood siding, window trim and porch details are common here and respond well to scraping, priming and caulking.', serviceSlug: 'exterior-painting' },
      { title: 'Drywall repairs after plumbing or remodel work', text: 'Open access holes and damaged sections get closed, finished and textured to blend.', serviceSlug: 'drywall-repair' },
      { title: 'Ceilings in older homes', text: 'Repair, refinish or remove, depending on material and testing results.', serviceSlug: 'popcorn-ceiling-removal' },
    ],
    goodToKnowHeading: 'Historic and conservation districts',
    goodToKnow: 'Some Dallas neighborhoods are in historic or conservation districts that review exterior changes, including paint colors. If your home might be in one, confirm with the city before picking an exterior palette. Interior work generally is not part of that review.',
    nearby: ['garland', 'richardson', 'plano'],
    questions: [
      { question: 'Which parts of Dallas do you serve?', answer: 'We focus on neighborhoods nearest Garland. Call or email with your address and the work you need and we will confirm whether it is within range.' },
      { question: 'Can you paint over old plaster walls?', answer: 'Often, yes, after repairing cracks and priming. We inspect the wall condition during the estimate to see what preparation is needed.' },
    ],
  },
  {
    slug: 'addison',
    name: 'Addison',
    summary: 'Townhomes, condos and compact homes: patch repairs, interior repaints and trim.',
    metaTitle: 'Painting & Drywall in Addison, TX',
    metaDescription: 'Interior painting, drywall patch repair and trim work for Addison, TX townhomes, condos and homes. Call INRI Paint & Wall for an estimate.',
    lead: 'We take painting and drywall repair projects in Addison, where much of the work is interior and focused on townhomes, condos and smaller homes.',
    contextHeading: 'Interior-focused projects in Addison townhomes and condos',
    context: [
      'Addison is a compact town with a mix of single-family streets, townhome communities and condominium or apartment buildings. That mix means many projects are interior-only and smaller in scale: a few rooms, a stairwell, a patched wall after a move, or a unit being prepared for a new tenant or owner.',
      'Smaller jobs still need a plan. Access, parking, elevators and quiet hours can affect scheduling in multi-unit buildings, so we ask about them up front. In attached homes we also watch for shared walls and ceilings, which can hide older repairs and varying textures.',
      'Because the scopes are compact, patch repair is a natural fit. Our published patch prices are a good starting point for small holes and dings, and larger repairs are quoted after a look at the wall.',
    ],
    needsHeading: 'What Addison residents tend to ask for',
    needs: [
      { title: 'Small patches after a move or remodel', text: 'Doorknob dents, picture-hanging holes and small damaged spots are repaired, textured and touched up.', serviceSlug: 'drywall-repair' },
      { title: 'Whole-unit interior repaints', text: 'Walls, ceilings and trim across a condo or townhome, planned around access and building rules.', serviceSlug: 'interior-painting' },
      { title: 'Wallpaper in older units', text: 'Removal, wall repair and a fresh painted finish in place of outdated paper.', serviceSlug: 'wallpaper-removal' },
      { title: 'Worn doors, baseboards and casings', text: 'Trim repair, caulking and repainting that makes a unit look newer without a full renovation.', serviceSlug: 'trim-and-wood-repair' },
    ],
    goodToKnowHeading: 'Check association rules for condos and townhomes',
    goodToKnow: 'Condominium and townhome associations often set rules for work hours, contractor insurance paperwork and anything visible from outside the unit. Ask your association what it requires before scheduling and tell us early. We can provide our insurance information with your estimate.',
    nearby: ['dallas', 'plano', 'richardson'],
    questions: [
      { question: 'Can you work inside a condo or apartment building?', answer: 'Yes. Tell us about association rules, building access or quiet hours when you request an estimate so we can schedule around them.' },
      { question: 'Do you only do small patch repairs in Addison?', answer: 'No. Small patches are a common request, and we also take on full interior repaints and trim work.' },
    ],
  },
];

export const areaSlugs = areas.map((area) => area.slug);
export function getArea(slug: string): Area | undefined {
  return areas.find((area) => area.slug === slug);
}
export const areaPath = (slug: string) => `/areas/${slug}`;
