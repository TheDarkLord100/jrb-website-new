import Hero from '@/components/sections/home/Hero';
import ResearchDomains from '@/components/sections/research/ResearchDomains';
import NewsAndAnnouncements from '@/components/sections/home/NewsAndAnnouncements';
import IndustryConnect from '@/components/sections/home/IndustryConnect';
import { getAllAnnouncements } from '@/lib/supabase/queries';

export default async function Home() {
  const initialAnnouncements = await getAllAnnouncements();

  return (
    <>
      <Hero />
      <ResearchDomains />
      <NewsAndAnnouncements initialItems={initialAnnouncements} />
      <IndustryConnect />
    </>
  );
}
