import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getJobListingOrganizationTag } from "../db/cache/jobListings";
import { db } from "@/drizzle/db";
import { and, count, eq } from "drizzle-orm";
import { JobListingTable } from "@/drizzle/schema";
import { hasPlanFeature } from "@/services/clerk/lib/planFeatures";

export const hasReachedMaxPublishedJobListings = async () => {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null) return true;

  const count = await getPublishedJobListingCount(orgId);

  const canPost = await Promise.all([
    hasPlanFeature("post_1_job_listing").then((has) => has && count < 1),
    hasPlanFeature("post_3_job_listings").then((has) => has && count < 3),
    hasPlanFeature("post_15_job_listings").then((has) => has && count < 15),
  ]);

  return !canPost.some(Boolean);
};

export const hasReachedMaxFeaturedJobListings = async () => {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null) return true;

  const count = await getFeaturedJobListingCount(orgId);

  const canFeature = await Promise.all([
    hasPlanFeature("1_featured_job_listing").then((has) => has && count < 1),
    hasPlanFeature("unlimited_featured_job_listings"),
  ]);

  return !canFeature.some(Boolean);
};

const getPublishedJobListingCount = async (orgId: string) => {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));

  const [res] = await db
    .select({ count: count() })
    .from(JobListingTable)
    .where(
      and(
        eq(JobListingTable.organizationId, orgId),
        eq(JobListingTable.status, "published")
      )
    );
  return res?.count ?? 0;
};

const getFeaturedJobListingCount = async (orgId: string) => {
  "use cache";
  cacheTag(getJobListingOrganizationTag(orgId));

  const [res] = await db
    .select({ count: count() })
    .from(JobListingTable)
    .where(
      and(
        eq(JobListingTable.organizationId, orgId),
        eq(JobListingTable.isFeatured, true)
      )
    );
  return res?.count ?? 0;
};
