import { describe, it, expect } from 'vitest';
import { business } from '../src/data/business';
import { pageMetadata, paintingContractorJsonLd, safeJsonLd, serviceJsonLd, websiteJsonLd } from '../src/lib/seo';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import { services } from '../src/data/services';

describe('SEO metadata', () => {
  it('produces specific title, description and self-canonical', () => {
    const meta = pageMetadata({title:'Drywall Repair in Garland',description:'Precise wall repairs near Garland, Texas.',path:'/services/drywall-repair'});
    expect(meta.title).toBe('Drywall Repair in Garland');
    expect(meta.description).toBe('Precise wall repairs near Garland, Texas.');
    expect(meta.alternates?.canonical).toBe('/services/drywall-repair');
    expect(meta.openGraph).toMatchObject({url:business.url+'/services/drywall-repair'});
  });
  it('normalizes root and a trailing slash', () => {
    expect(pageMetadata({title:'Home',description:'Test',path:'/'}).alternates?.canonical).toBe('/');
    expect(pageMetadata({title:'About',description:'Test',path:'/about/'}).alternates?.canonical).toBe('/about');
  });
  it('escapes script-breaking characters in JSON-LD', () => {
    expect(safeJsonLd({value:'</script><script>alert(1)</script>'})).not.toContain('</script>');
  });
  it('omits addresses and ratings, but includes owner-supplied hours, logo and social profiles', () => {
    const schema = paintingContractorJsonLd();
    const text = JSON.stringify(schema);
    expect(schema['@type']).toBe('PaintingContractor');
    expect(text).toContain('Garland');
    expect(schema.sameAs.length).toBeGreaterThanOrEqual(6);
    expect(schema.openingHoursSpecification[0].dayOfWeek).toHaveLength(6);
    expect(schema.logo).toBe(business.url+'/inri-logo.png');
    expect(text).not.toMatch(/streetAddress|aggregateRating|reviewCount|geoCoordinates|Austin|Balcones/);
  });
  it('adds connected site and service entities without unsupported claims', () => {
    expect(websiteJsonLd()).toMatchObject({ '@type': 'WebSite', publisher: { '@id': business.url + '/#business' } });
    expect(serviceJsonLd({ name: 'Drywall Repair', description: 'Wall repairs.', path: '/services/drywall-repair' })).toMatchObject({
      '@type': 'Service', provider: { '@id': business.url + '/#business' }, url: business.url + '/services/drywall-repair',
    });
  });
});

describe('indexing metadata files', () => {
  it('lists every real public marketing route including services', () => {
    const urls=sitemap().map(entry=>entry.url);
    expect(urls).toContain(business.url+'/');
    expect(urls).toContain(business.url+'/services');
    for (const service of services) expect(urls).toContain(business.url+'/services/'+service.slug);
    expect(new Set(urls).size).toBe(urls.length);
  });
  it('excludes auth, account and financial routes', () => {
    const urls=sitemap().map(entry=>entry.url).join('\n');
    expect(urls).not.toMatch(/auth|signup|login|dashboard|invoice|receipt|client|finance|contract|estimate\/general/);
  });
  it('keeps robots sitemap link in sync with canonical hostname', () => {
    expect(robots().sitemap).toBe(business.url+'/sitemap.xml');
    expect(robots().host).toBe(business.url);
  });
});
