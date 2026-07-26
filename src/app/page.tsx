import Hero from '@/components/sections/home/Hero';
import ResearchDomains from '@/components/sections/research/ResearchDomains';
import NewsAndAnnouncements from '@/components/sections/home/NewsAndAnnouncements';
import IndustryConnect from '@/components/sections/home/IndustryConnect';

export default function Home() {
  return (
    <>
      <Hero />
      <ResearchDomains />
      <NewsAndAnnouncements />
      <IndustryConnect />
    </>
  );
}
