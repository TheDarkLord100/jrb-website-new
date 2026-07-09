import Hero from "@/components/sections/Hero";
import ResearchDomains from "@/components/sections/ResearchDomains";
import NewsAndAnnouncements from "@/components/sections/NewsAndAnnouncements";
import Collaborators from "@/components/sections/Collaborators";

export default function Home() {
  return (
    <>
      <Hero />
      <ResearchDomains />
      <NewsAndAnnouncements />
      <Collaborators />
    </>
  );
}
