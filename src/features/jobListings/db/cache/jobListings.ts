import { getGlobalTag, getIdTag, getOrganizationTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getJobListingGlobalTag = () => {
  return getGlobalTag("jobListings");
};

export const getJobListingOrganizationTag = (organizationId: string) => {
  return getOrganizationTag("jobListings", organizationId);
};

export const getJobListingIdTag = (id: string) => {
  return getIdTag("jobListings", id);
};

export const revalidateJobListingCache = ({
  id,
  organizationId,
}: {
  id: string;
  organizationId: string;
}) => {
  revalidateTag(getJobListingGlobalTag());
  revalidateTag(getJobListingOrganizationTag(organizationId));
  revalidateTag(getJobListingIdTag(id));
};
