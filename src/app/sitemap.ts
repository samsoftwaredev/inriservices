import type { MetadataRoute } from 'next';
import { business, publicPaths } from '../data/business';
import { services } from '../data/services';
import { areas, areaPath } from '../data/areas';
import { guides, guidePath } from '../data/guides';

/**
 * Only deliberate public marketing pages. Google ignores <priority> and <changefreq>, and a
 * <lastmod> is only useful when it is accurate, so none are emitted rather than guessed.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const urls = [...publicPaths, ...services.map(s => `/services/${s.slug}`), ...areas.map(a => areaPath(a.slug)), ...guides.map(g => guidePath(g.slug))];
  return urls.map(path => ({ url: new URL(path, business.url).toString() }));
}
