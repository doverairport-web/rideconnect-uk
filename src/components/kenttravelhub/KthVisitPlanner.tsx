import { KthVisitPlannerContent } from "@/components/kenttravelhub/KthVisitPlannerContent";
import { kthPath } from "@/lib/kenttravelhub/paths";

export async function KthVisitPlanner() {
  const visit = await kthPath("/visit");
  return <KthVisitPlannerContent visitHref={visit} showFullLink={false} />;
}
