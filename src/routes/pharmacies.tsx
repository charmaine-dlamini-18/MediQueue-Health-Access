import { createFileRoute } from "@tanstack/react-router";
import { FacilityListPage } from "./clinics";

export const Route = createFileRoute("/pharmacies")({
  head: () => ({ meta: [{ title: "Find a Pharmacy · MediQueue" }] }),
  component: () => <FacilityListPage type="pharmacy" title="Find a Pharmacy" description="Locate pharmacies with opening hours and directions." />,
});