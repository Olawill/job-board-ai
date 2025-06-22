import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateJobListingCache } from "./cache/jobListings";

export const insertJobListing = async (
  jobListing: typeof JobListingTable.$inferInsert
) => {
  const [newJobListing] = await db
    .insert(JobListingTable)
    .values(jobListing)
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingCache(newJobListing);

  return newJobListing;
};

export const updateJobListing = async (
  id: string,
  jobListing: Partial<typeof JobListingTable.$inferInsert>
) => {
  const [updatedListing] = await db
    .update(JobListingTable)
    .set(jobListing)
    .where(eq(JobListingTable.id, id))
    .returning({
      id: JobListingTable.id,
      organizationId: JobListingTable.organizationId,
    });

  revalidateJobListingCache(updatedListing);

  return updatedListing;
};

export const deleteJobListing = async (id: string) => {
  await db.delete(JobListingTable).where(eq(JobListingTable.id, id));

  // revalidateJobListingCache(id);
};
