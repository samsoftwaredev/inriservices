export type GuideSection = { heading: string; paragraphs?: readonly string[]; list?: readonly string[] };
export type Guide = {
  slug: string; title: string; metaTitle: string; description: string; summary: string;
  published: string; related: readonly string[]; sections: readonly GuideSection[];
};

/**
 * Practical homeowner guides. Written to be accurate and cautious: no invented statistics, no legal
 * advice, and clear hand-offs to testing labs or specialists where the work is outside painting.
 */
export const guides: readonly Guide[] = [
  {
    slug: 'popcorn-ceiling-asbestos-texas',
    title: 'Is my popcorn ceiling asbestos? What Texas homeowners should know',
    metaTitle: 'Popcorn Ceiling Asbestos: What to Know',
    description: 'Older popcorn ceilings can contain asbestos. Learn when to test, what not to do before results and how removal works if the ceiling is clear.',
    summary: 'Older textured ceilings can contain asbestos. Here is when testing makes sense and what to do before anyone scrapes.',
    published: '2026-11-15',
    related: ['popcorn-ceiling-removal', 'drywall-repair'],
    sections: [
      { heading: 'Why age matters', paragraphs: ['Spray-on ceiling texture, often called popcorn or acoustic ceiling, was common for decades. Some of it, especially in homes built before the 1980s, was made with asbestos. Texture applied later is much less likely to contain it, but age alone cannot tell you for certain, because older stock was sometimes used after newer products appeared.', 'Asbestos fibers are only a risk when material is disturbed and fibers become airborne. An intact ceiling that is left alone is generally not the concern. Scraping, sanding, drilling and demolition are.'] },
      { heading: 'The only reliable answer is a lab test', paragraphs: ['You cannot identify asbestos by looking at it. A small sample is sent to an accredited laboratory, which reports whether asbestos is present. Sampling itself can release fibers if done carelessly, so many homeowners have a qualified inspector take the sample.'] },
      { heading: 'Before you have results', list: ['Do not scrape, sand, spray with water and scrape, or poke holes in the ceiling.', 'Avoid hanging heavy fixtures or cutting recessed lights into the ceiling.', 'Keep children and pets out of any area where the texture is flaking.', 'Tell any contractor the age of your home before they quote ceiling work.'] },
      { heading: 'If the test is negative', paragraphs: ['A negative result means removal can be handled as a normal painting and drywall job. The ceiling is protected, the texture is removed or skimmed, damaged spots are repaired and the surface is primed and painted. Patching a small area and blending the texture is another option when you only need a repair.'] },
      { heading: 'If the test is positive', paragraphs: ['A positive result usually means the safest options are to leave the texture undisturbed, to seal or cover it, or to hire a licensed asbestos abatement professional to remove it. Painting and drywall contractors should not remove material that tests positive. Ask the abatement company what documentation they provide, and plan any repainting for after they finish.'] },
      { heading: 'What to ask any contractor', list: ['Do you want a test result before starting?', 'How will floors and furniture be protected from debris?', 'What will the ceiling look like when finished (smooth, retextured, repainted)?', 'What is included: repairs, primer, paint and cleanup?'] },
    ],
  },
  {
    slug: 'why-drywall-cracks-return-north-texas',
    title: 'Why do drywall cracks keep coming back in North Texas?',
    metaTitle: 'Why Drywall Cracks Keep Returning',
    description: 'Clay soil movement is a common reason hairline drywall cracks reopen in the Dallas area. Learn which cracks are cosmetic and when to call a foundation specialist.',
    summary: 'Seasonal soil movement is a common reason cracks reopen. Here is how to tell cosmetic cracks from ones to have checked.',
    published: '2026-11-15',
    related: ['drywall-repair', 'interior-painting'],
    sections: [
      { heading: 'The ground under many North Texas homes moves', paragraphs: ['Much of the Dallas area sits on clay soil that swells when wet and shrinks when dry. As the seasons and weather swing between drought and heavy rain, the ground under a house can shift a little, and that small movement is transferred to walls and ceilings. New homes also settle during their first years.', 'Drywall is rigid, so that movement shows up as thin cracks, usually at the weakest points: above doors and windows, along ceiling lines and in the corners of rooms.'] },
      { heading: 'Cracks that are usually cosmetic', list: ['Hairline cracks above door and window frames.', 'Thin cracks along taped joints or where walls meet the ceiling.', 'Small nail pops, where a fastener pushes through the surface.', 'Cracks that stay about the same width over time.'] },
      { heading: 'Why a quick fix may not last', paragraphs: ['Filling a crack and painting over it restores the look, but if the wall is still moving the crack can reopen. A repair that lasts removes loose material, uses the right tape and compound for the location, and is finished and textured so the patch blends in. In places that flex, a flexible product is often a better choice than hard filler.', 'Even a good repair can show a thin line again after a particularly dry summer or wet spring. That does not mean the repair was wrong, only that the house moved again.'] },
      { heading: 'When to have the house checked first', list: ['Cracks wider than about a quarter inch.', 'Stair-step cracks in exterior brick or diagonal cracks running from corners of doors or windows.', 'Doors or windows that suddenly stick or no longer latch.', 'Floors that slope or gaps opening between walls and floors or ceilings.', 'Cracks that grow week to week.'] },
      { heading: 'What to do next', paragraphs: ['If you see warning signs, a foundation or structural specialist should look at the house before cosmetic repairs are made. For ordinary hairline cracks and nail pops, a careful drywall repair followed by primer and paint is the right fix. Send us a photo and we can tell you which category your wall looks like.'] },
    ],
  },
  {
    slug: 'drywall-patch-sizes-explained',
    title: 'Small, medium and large drywall patches explained',
    metaTitle: 'Drywall Patch Sizes & Pricing Explained',
    description: 'What goes into a small, medium or large drywall patch, why bigger holes cost more, and how our published patch prices work.',
    summary: 'What a small, medium and large patch actually involves, and why the price steps up with size.',
    published: '2026-11-15',
    related: ['drywall-repair', 'interior-painting'],
    sections: [
      { heading: 'Patch size is about work, not just hole size', paragraphs: ['A patch is more than filling a hole. The area is prepared, repaired, finished smooth, textured to match and painted so the repair disappears. The bigger the damage, the more material, drying time and finishing steps are involved. We group patches into three sizes, with starting prices that reflect the work.'] },
      { heading: 'Small patch: 1 to 5 inches ($50 to $100)', paragraphs: ['Think nail holes, anchor holes, doorknob dings and small dents. These are typically filled, sanded smooth, textured and touched up. Because they are quick, we offer a bundle of three small patches with touch-up paint for $200.'] },
      { heading: 'Medium patch: 6 to 12 inches ($150 to $250)', paragraphs: ['This is the size of a fist-through hole or a section damaged by a leak or a removed fixture. The damaged piece is cut back to solid drywall, new drywall is secured, and the seams are taped and finished in several thin coats that need time to dry, then textured and painted. Precision matters here because larger patches are easier to see if the finish is not blended.'] },
      { heading: 'Large patch: 13 inches and up (from $300)', paragraphs: ['Large repairs often involve replacing a whole section of drywall, adding backing to support the new piece, taping, multiple coats of compound, texture and paint across a wider area. They take more material and more time, so pricing starts at $300 and is confirmed after we see the damage.'] },
      { heading: 'What affects the final price', list: ['The size and number of damaged areas.', 'The wall or ceiling texture that must be matched.', 'Access: ceilings, stairwells and high walls take more setup.', 'Whether the finish is touch-up paint or a full wall repaint for an even look.', 'Hidden problems such as moisture, which we always discuss before continuing.'] },
      { heading: 'Get an accurate number', paragraphs: ['Send a photo of the damage next to something for scale, like a coin or a tape measure, with your estimate request. Our prices are starting points. Estimates are $30, deducted from your final price if you go ahead, and we confirm the scope before any work begins.'] },
    ],
  },
  {
    slug: 'how-to-prepare-for-a-painter',
    title: 'How to prepare your home for a painter',
    metaTitle: 'How to Prepare Your Home for a Painter',
    description: 'A simple checklist for homeowners before painters arrive: what to move, what to decide and what to tell your contractor so the job goes smoothly.',
    summary: 'A short checklist that saves time on painting day and helps your estimate match the real job.',
    published: '2026-11-15',
    related: ['interior-painting', 'exterior-painting'],
    sections: [
      { heading: 'Decide what is in scope', paragraphs: ['Walk through with a list of every surface you want painted or repaired: walls, ceilings, trim, doors, cabinets. Note every hole, crack, stain or peeling area, even small ones. Photos on your phone are the easiest way to show a painter exactly what you mean.'] },
      { heading: 'Choose colors before work starts', list: ['Test samples on the wall itself and look at them morning, afternoon and evening.', 'Pick the sheen for each surface: matte or eggshell for walls, satin or semi-gloss for trim, doors and kitchens or baths.', 'If you want to keep an existing color, ask about color matching. It can be matched even without the original can.'] },
      { heading: 'Clear the space', list: ['Move small items, decor, wall art and anything fragile or valuable.', 'Take things off shelves and out of closets in rooms being painted.', 'Your contractor should carefully move and cover larger furniture and protect floors.', 'Plan where pets and children will be during work hours.'] },
      { heading: 'Tell your painter early', list: ['The age of your home, especially if it was built before 1978 (paint from before 1978 may contain lead).', 'Known moisture, leaks or previous water damage.', 'Association rules for exterior colors or contractor hours.', 'Any access issues: stairs, gates, limited parking or work-from-home needs.'] },
      { heading: 'On the day', paragraphs: ['Make sure the crew can reach the work areas and that power and water are available. Expect some odor from paint, which low-VOC products reduce, and keep windows open where possible. Skip heavy activity in freshly painted rooms until the paint has cured as directed.'] },
      { heading: 'Final walkthrough', paragraphs: ['Before the crew leaves, walk the finished rooms with the lead painter in good light. Point out anything you want touched up and confirm anything left to finish. A written estimate and a clear scope make this step easy.'] },
    ],
  },
];

export const guideSlugs = guides.map((g) => g.slug);
export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);
export const guidePath = (slug: string) => `/guides/${slug}`;
