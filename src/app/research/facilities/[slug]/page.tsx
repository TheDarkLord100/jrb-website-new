import {
  getLabSlugs,
  getLabBySlug,
  getLabImages,
  getLabAnnouncements,
} from '@/lib/supabase/queries';
import LabDetail from '@/components/sections/research/LabDetail';
import { buildMetadata } from '@/lib/metadata';

export async function generateStaticParams() {
  const slugs = await getLabSlugs();
  if (slugs.length === 0) {
    return [{ slug: '_placeholder' }];
  }
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = await getLabBySlug(slug);
  return buildMetadata({
    title: lab?.name ?? 'Lab',
    description:
      lab?.description ??
      'A research facility at CoE-BIRD, the Centre of Excellence on Biologically Inspired Robots and Drones at IIT Delhi.',
    path: `/research/facilities/${slug}`,
  });
}

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = await getLabBySlug(slug);

  if (!lab) {
    return <LabDetail slug={slug} initialData={{ lab: null, images: [], announcements: [] }} />;
  }

  const [images, announcements] = await Promise.all([
    getLabImages(lab.id),
    getLabAnnouncements(lab.id),
  ]);

  return <LabDetail slug={slug} initialData={{ lab, images, announcements }} />;
}
