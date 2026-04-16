import { PageShell } from "@/components/PageShell";
import { getActiveCases } from "@/lib/queries";
import { MOCK_CASES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const liveCases = await getActiveCases();
  const cases = liveCases.length > 0 ? liveCases : MOCK_CASES;

  return <PageShell cases={cases} />;
}
