type CacheTag =
  | "users"
  | "organizations"
  | "jobListings"
  | "userNotificationSettings"
  | "userResumes"
  | "jobListingApplications"
  | "organizationUserSettings";

export const getGlobalTag = (tag: CacheTag) => {
  return `global:${tag}` as const;
};

export const getOrganizationTag = (tag: CacheTag, organizationId: string) => {
  return `organizationId:${organizationId}-${tag}` as const;
};

export const getIdTag = (tag: CacheTag, id: string) => {
  return `id:${id}-${tag}` as const;
};

export const getJobListingTag = (tag: CacheTag, jobListingId: string) => {
  return `jobListing:${jobListingId}-${tag}`;
};
