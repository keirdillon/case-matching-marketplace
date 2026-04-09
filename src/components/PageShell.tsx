"use client";

import { useState } from "react";
import type { CaseWithAdvisor } from "@/lib/database.types";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { CaseBoard } from "@/components/CaseBoard";
import { CtaDark } from "@/components/CtaDark";
import { Footer } from "@/components/Footer";
import { PostCaseModal } from "@/components/PostCaseModal";

export function PageShell({ cases }: { cases: CaseWithAdvisor[] }) {
  const [postModalOpen, setPostModalOpen] = useState(false);

  return (
    <>
      <Nav />
      <Hero onPostCase={() => setPostModalOpen(true)} />
      <StatsBar />
      <CaseBoard cases={cases} />
      <CtaDark />
      <Footer />
      <PostCaseModal open={postModalOpen} onClose={() => setPostModalOpen(false)} />
    </>
  );
}
