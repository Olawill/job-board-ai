import { Suspense } from "react";
import { desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { JobListingTable } from "@/drizzle/schema";

import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { getJobListingOrganizationTag } from "@/features/jobListings/db/cache/jobListings";

const EmployerHomePage = () => {
  return (
    <Suspense>
      <SuspendedPage />
    </Suspense>
  );
};

const SuspendedPage = async () => {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null) return null;

  const jobListing = await getMostRecentJobListing(orgId);

  if (jobListing == null) {
    redirect("/employer/job-listings/new");
  } else {
    redirect(`/employer/job-listings/${jobListing.id}`);
  }
};

const getMostRecentJobListing = async (orgId: string) => {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));

  return await db.query.JobListingTable.findFirst({
    where: eq(JobListingTable.organizationId, orgId),
    orderBy: desc(JobListingTable.createdAt),
    columns: { id: true },
  });
};

export default EmployerHomePage;
