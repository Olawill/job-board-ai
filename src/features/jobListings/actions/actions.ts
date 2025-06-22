"use server";

import { z } from "zod";
import { redirect } from "next/navigation";

import { jobListingSchema } from "./schema";
import {
  insertJobListing,
  updateJobListing as updateJobListingDb,
} from "../db/jobListings";

import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { getJobListing } from "@/app/employer/job-listings/[jobListingId]/page";

export const createJobListing = async (
  unsafeData: z.infer<typeof jobListingSchema>
) => {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null) {
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

  if (orgId == null) {
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
