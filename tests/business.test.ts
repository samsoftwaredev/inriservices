import { describe, it, expect } from 'vitest';
import { business, publicPaths, navLinks } from '../src/data/business';
import { services, getService, serviceSlugs } from '../src/data/services';

describe('business data', () => {
  it('uses a single canonical HTTPS hostname', () => {
    expect(business.url).toBe('https://www.inripaintwall.com');
    expect(new URL(business.url).protocol).toBe('https:');
  });
  it('contains contactable phone and email data', () => {
    expect(business.phone).toMatch(/^\+1\d{10}$/);
    expect(business.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
  });
  it('has unique navigation and marketing paths', () => {
    expect(new Set(publicPaths).size).toBe(publicPaths.length);
    for (const { href } of navLinks) expect(publicPaths).toContain(href);
  });
});

describe('service catalog', () => {
  it('contains unique, human-readable slugs and substantive copy', () => {
    expect(services.length).toBeGreaterThanOrEqual(5);
    expect(new Set(serviceSlugs).size).toBe(services.length);
    for (const service of services) {
      expect(service.slug).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
      expect(service.description.length).toBeGreaterThan(70);
      expect(service.tasks.length).toBeGreaterThan(2);
      expect(service.questions.length).toBeGreaterThan(0);
      expect(getService(service.slug)).toEqual(service);
    }
  });
  it('does not fabricate an unknown service page', () => {
    expect(getService('not-a-real-service')).toBeUndefined();
  });
});
