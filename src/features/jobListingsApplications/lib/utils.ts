import { ApplicationStage } from "@/drizzle/schema";

export const sortApplicationsByStage = (
  a: ApplicationStage,
  b: ApplicationStage
) => {
  return APPLICATION_STAGE_SORT_ORDER[a] - APPLICATION_STAGE_SORT_ORDER[b];
};

const APPLICATION_STAGE_SORT_ORDER: Record<ApplicationStage, number> = {
  applied: 0,
  interested: 1,
  interviewed: 2,
  hired: 3,
  denied: 4,
};
