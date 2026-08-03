import { KthHomeDashboardClient } from "@/components/kenttravelhub/KthHomeDashboardClient";
import { KTH_LIVE_EXTERNAL_LINKS } from "@/lib/kenttravelhub/live-links";
import { kthPath } from "@/lib/kenttravelhub/paths";
import { kthHomeSections } from "@/lib/kenttravelhub/sections";

export async function KthHomeDashboard() {
  const sections = kthHomeSections();

  const [cruise, ferries, live, visit, cruiseTerminal, cruiseSchedule, ferryTimetable] =
    await Promise.all([
      kthPath("/cruise"),
      kthPath("/ferries"),
      kthPath("/live"),
      kthPath("/visit"),
      kthPath("/cruise-terminal"),
      Promise.resolve(KTH_LIVE_EXTERNAL_LINKS.cruise.href),
      Promise.resolve(KTH_LIVE_EXTERNAL_LINKS.ferryTimetable.href),
    ]);

  return (
    <KthHomeDashboardClient
      sections={sections}
      paths={{
        sections: { cruise, ferries, live, visit },
        cruiseSchedule,
        cruiseTerminal,
        ferryTimetable,
      }}
    />
  );
}
