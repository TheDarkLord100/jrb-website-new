import Hero from "@/components/sections/Hero";
import ResearchDomains from "@/components/sections/ResearchDomains";
import NewsAndAnnouncements from "@/components/sections/NewsAndAnnouncements";
import IndustryConnect from "@/components/sections/IndustryConnect";

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