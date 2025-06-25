import { db } from "@/drizzle/db";
import { JobListingApplicationTable } from "@/drizzle/schema";
import { revalidateJobListingApplicationCache } from "./cache/jobListingApplications";

export const insertJobListingApplication = async (
  application: typeof JobListingApplicationTable.$inferInsert
) => {
  await db.insert(JobListingApplicationTable).values(application);

  revalidateJobListingApplicationCache(application);
};
