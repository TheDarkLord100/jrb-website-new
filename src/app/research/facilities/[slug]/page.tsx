import { getLabSlugs, getLabBySlug } from "@/lib/supabase/queries";
import LabDetail from "@/components/sections/LabDetail";

// Static export: every lab's URL must be known when `next build` runs. A
// lab added after the last build/deploy won't have a routable page until
// the site is rebuilt and redeployed — there's no server to generate pages
// on demand.
//
// Important: `output: 'export'` treats a genuinely empty result from this
// function as a build error ("missing generateStaticParams"), not as "zero
// pages" — confirmed by testing. That would mean the very first build
// (before labs_seed.sql has been run, or if the Supabase env vars are ever
// misconfigured at build time) breaks the ENTIRE site, not just this route.
// The fallback below guarantees at least one path always exists; visiting
// it just shows LabDetail's normal "couldn't be found" state, which is
// harmless since nothing links to it.
export async function generateStaticParams() {
  const slugs = await getLabSlugs();
  if (slugs.length === 0) {
    return [{ slug: "_placeholder" }];
  }
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lab = await getLabBySlug(slug);
  return { title: lab?.name ?? "Lab" };
}

export default async function LabPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LabDetail slug={slug} />;
}