import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { BigWords, Cta, Footer, NotesBento, Playground, Projects, Stats, Ticker } from "@/components/Sections";
import { OutputGame } from "@/components/OutputGame";
import { getNotes, getProjects, getStats } from "@/lib/content";
import { QUESTION_COUNT } from "@/lib/questions";

export default function Home() {
  const notes = getNotes();
  const projects = getProjects();
  const stats = getStats();
  const topics = [
    ...notes.map((n) => n.title.replace(/\s*[(:].*$/, "").slice(0, 40)),
    "Recursion",
    "Call Stack",
    "Backtracking",
    "System Design",
    "GitHub Repos",
    "AI Tools",
  ];

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker topics={topics} />
        <Stats {...stats} questions={QUESTION_COUNT} />
        <NotesBento notes={notes} />
        <BigWords />
        <Playground />
        <OutputGame />
        <Projects projects={projects} />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
