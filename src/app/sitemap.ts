import type { MetadataRoute } from 'next';
import { getLabSlugs } from '@/lib/supabase/queries';

export const dynamic = 'force-static';

const SITE_URL = 'https://robotics.iitd.ac.in';

const staticRoutes = [
  '',
  '/about',
  '/people',
  '/contact',
  '/events',
  '/industry',
  '/academics/mtech',
  '/academics/minor',
  '/academics/admissions',
  '/research/themes',
  '/research/themes/cross-cutting',
  '/research/themes/field-robotics',
  '/research/themes/human-robotics',
  '/research/themes/soft-bio-robotics',
  '/research/facilities',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const labSlugs = await getLabSlugs();
  const labRoutes = labSlugs.map((slug) => `/research/facilities/${slug}`);

  return [...staticRoutes, ...labRoutes].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
  }));
}
