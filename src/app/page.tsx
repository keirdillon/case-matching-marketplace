import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { CaseBoard } from "@/components/CaseBoard";
import { CtaDark } from "@/components/CtaDark";
import { Footer } from "@/components/Footer";
import { getActiveCases } from "@/lib/queries";
import { MOCK_CASES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function CaseBoardPage() {
  const liveCases = await getActiveCases();
  const cases = liveCases.length > 0 ? liveCases : MOCK_CASES;

  return (
    <>
      <Nav />
      <Hero />
      <StatsBar />
      <CaseBoard cases={cases} />
      <CtaDark />
      <Footer />
    </>
  );
}
