"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { jobListingSchema } from "./schema";
import {
  insertJobListing,
  updateJobListing as updateJobListingDb,
  deleteJobListing as deleteJobListingDb,
} from "../db/jobListings";

import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { getJobListing } from "@/app/employer/job-listings/[jobListingId]/page";
import { hasOrgUserPermission } from "@/services/clerk/lib/orgUserPermissions";
import { getNextJobListingStatus } from "../lib/utils";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "../lib/planFeatureHelpers";

export const createJobListing = async (
  unsafeData: z.infer<typeof jobListingSchema>
) => {
  const { orgId } = await getCurrentOrganization();

  if (
    orgId == null ||
    !(await hasOrgUserPermission("org:job_listings:create"))
  ) {
    return {
      error: true,
      message: "You don't have permission to create a job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "There was an error creating your job listing",
    };
  }

  const jobListing = await insertJobListing({
    ...data,
    organizationId: orgId,
    status: "draft",
  });

  redirect(`/employer/job-listings/${jobListing.id}`);
};

export const updateJobListing = async (
  id: string,
  unsafeData: z.infer<typeof jobListingSchema>
) => {
  const { orgId } = await getCurrentOrganization();

  if (
    orgId == null ||
    !(await hasOrgUserPermission("org:job_listings:update"))
  ) {
    return {
      error: true,
      message: "You don't have permission to update this job listing",
    };
  }

  const { success, data } = jobListingSchema.safeParse(unsafeData);

  if (!success) {
    return {
      error: true,
      message: "There was an error updating your job listing",
    };
  }

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) {
    return {
      error: true,
      message: "Job Listing not found.",
    };
  }

  const updatedJobListing = await updateJobListingDb(jobListing.id, data);

  redirect(`/employer/job-listings/${updatedJobListing.id}`);
};

export const toggleJobListingStatus = async (id: string) => {
  const error = {
    error: true,
    message: "You don't have permission to update this job listing status",
  };

  const { orgId } = await getCurrentOrganization();

  if (orgId == null) return error;

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) return error;

  const newStatus = getNextJobListingStatus(jobListing.status);

  if (
    !(await hasOrgUserPermission("org:job_listings:change_status")) ||
    (newStatus === "published" && (await hasReachedMaxPublishedJobListings()))
  ) {
    return error;
  }

  await updateJobListingDb(id, {
    status: newStatus,
    isFeatured: newStatus === "published" ? undefined : false,
    postedAt:
      newStatus === "published" && jobListing.postedAt == null
        ? new Date()
        : undefined,
  });

  return { error: false, message: "Job listing status updated" };
};

export const toggleJobListingFeatured = async (id: string) => {
  const error = {
    error: true,
    message:
      "You don't have permission to update this job listing's feature status",
  };

  const { orgId } = await getCurrentOrganization();

  if (orgId == null) return error;

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) return error;

  const newFeatureStatus = !jobListing.isFeatured;

  if (
    !(await hasOrgUserPermission("org:job_listings:change_status")) ||
    (newFeatureStatus && (await hasReachedMaxFeaturedJobListings()))
  ) {
    return error;
  }

  await updateJobListingDb(id, {
    isFeatured: newFeatureStatus,
  });

  return { error: false, message: "Job listing feature status updated" };
};

export const deleteJobListing = async (id: string) => {
  const error = {
    error: true,
    message: "You don't have permission to delete this job listing",
  };

  const { orgId } = await getCurrentOrganization();

  if (orgId == null) return error;

  const jobListing = await getJobListing(id, orgId);

  if (jobListing == null) return error;

  if (!(await hasOrgUserPermission("org:job_listings:delete"))) {
    return error;
  }

  await deleteJobListingDb(id);

  redirect("/employer");
};
