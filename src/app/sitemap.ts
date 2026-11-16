import type { MetadataRoute } from 'next';
import { business, publicPaths } from '../data/business';
import { services } from '../data/services';
import { areas, areaPath } from '../data/areas';

/**
 * Only deliberate public marketing pages. Google ignores <priority> and <changefreq>, and a
 * <lastmod> is only useful when it is accurate, so none are emitted rather than guessed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const urls = [...publicPaths, ...services.map(s => `/services/${s.slug}`), ...areas.map(a => areaPath(a.slug))];
  return urls.map(path => ({ url: new URL(path, business.url).toString() }));
}
