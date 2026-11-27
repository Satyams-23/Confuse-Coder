import { redirect } from "next/navigation";

// Short link DM'd to people who comment ROADMAP on a career-roadmap reel.
export default function RoadmapShortLink() {
  redirect("/roadmaps");
}
