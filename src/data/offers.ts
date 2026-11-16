/** Pricing supplied by the business owner for patch repairs. Larger scopes are quoted individually. */
export const patchPackages = [
  { name: 'Small patch', size: '1–5 inches', blurb: 'Quick fixes for minor damage', price: '$50 – $100' },
  { name: 'Medium patch', size: '6–12 inches', blurb: 'For moderate repairs that need precision', price: '$150 – $250' },
  { name: 'Large patch', size: '13+ inches', blurb: 'Extensive repairs requiring more materials and time', price: '$300+' },
] as const;

export const bundleOffer = { title: '3 small patches + touch-up paint', price: '$200' } as const;

/** Excerpts of real customer reviews as published on the owner's existing site and Google profile. Do not edit wording or add reviews not left by customers. */
export const reviews = [
  { name: 'Leslie Z.', source: 'Customer review', text: "I can't say enough good things about INRI Paint & Wall LLC! From the moment I called them, I felt like they really cared. They painted my kitchen cabinets in a beautiful, clean royal blue that just transformed the whole space. The job was neat, fast, and super professional. I also had some drywall repair done in my hallway and the family room wow!!, I couldn't even tell there was ever damage! …" },
  { name: 'angelica contreras', source: 'Customer review', text: 'Excellent and very detailed work! I was very impressed with the work they did on my garage. It had many imperfections on the ceiling and walls, but now it looks like a completely different space. They repaired the drywall, applied the perfect texture, and painted everything with great care. … They were also very punctual, respectful, and left everything clean. I highly recommend them.' },
  { name: 'Torie Sevier', source: 'Customer review', text: 'We had our interior house painted. They did a fantastic job. I would highly recommend them to my friends and families. … They were very detailed, punctual, professional, hardworking, and dedicated to the tasks. They fixed the damages I had in my kitchen and dining room. Just a SUPERB job!!' },
  { name: 'Gustavo Zaragoza', source: 'Google review', text: 'We hired INRI Paint & Wall LLC in Garland for drywall repair and interior painting, and the results were outstanding. We had several cracks, patched areas, and texture issues on our walls, and after they finished, everything blended …' },
  { name: 'Omar Ruiz Geronimo', source: 'Google review', text: 'INRI Paint & Wall LLC did an excellent job with our drywall repairs and texture matching. We had several patched areas on walls and near ceilings that were very noticeable before, but after their work, everything blends seamlessly. You …' },
  { name: 'Erick Avila', source: 'Google review', text: 'INRI Paint & Wall LLC did an amazing job staining my fence. The team was fast, on time, and paid attention to every detail. The finish came out even, clean, and made my old fence look brand new. …' },
] as const;
