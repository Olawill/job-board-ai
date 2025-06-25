import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/drizzle/db";
import {
  experienceLevels,
  JobListingTable,
  jobListingTypes,
  locationRequirements,
  OrganizationTable,
} from "@/drizzle/schema";
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges";
import { getJobListingGlobalTag } from "@/features/jobListings/db/cache/jobListings";
import { getOrganizationIdTag } from "@/features/organizations/db/cache/organizations";
import { convertSearchParamsToString } from "@/lib/convertSearchParamsToString";
import { cn } from "@/lib/utils";
import { differenceInDays } from "date-fns";
import { and, desc, eq, ilike, or, SQL } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { z } from "zod";

type Props = {
  searchParams: Promise<Record<string, string | string[]>>;
  params?: Promise<{ jobListingId: string }>;
};

const searchParamsSchema = z.object({
  title: z.string().optional().catch(undefined),
  city: z.string().optional().catch(undefined),
  state: z.string().optional().catch(undefined),
  experience: z.enum(experienceLevels).optional().catch(undefined),
  locationRequirement: z.enum(locationRequirements).optional().catch(undefined),
  type: z.enum(jobListingTypes).optional().catch(undefined),
  jobIds: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : [v]))
    .optional()
    .catch([]),
});

export const JobListingItems = (props: Props) => {
  return (
    <Suspense>
      <SuspendedComponent {...props} />
    </Suspense>
  );
};

const SuspendedComponent = async ({ searchParams, params }: Props) => {
  const jobListingId = params ? (await params).jobListingId : undefined;

  const { success, data } = searchParamsSchema.safeParse(await searchParams);

  const search = success ? data : {};

  const jobListings = await getJobListings(search, jobListingId);

  if (jobListings.length === 0) {
    return (
      <div className="text-muted-foreground p-4">No job listings found</div>
    );
  }

  return (
    <div className="space-y-4">
      {jobListings.map((jobListing) => (
        <Link
          href={`/job-listings/${jobListing.id}?${convertSearchParamsToString(search)}`}
          className="block"
          key={jobListing.id}
        >
          <JobListingListItem
            jobListing={jobListing}
            organization={jobListing.organization}
          />
        </Link>
      ))}
    </div>
  );
};

const JobListingListItem = ({
  jobListing,
  organization,
}: {
  jobListing: Pick<
    typeof JobListingTable.$inferSelect,
    | "title"
    | "stateAbbreviation"
    | "city"
    | "wage"
    | "wageInterval"
    | "experienceLevel"
    | "type"
    | "postedAt"
    | "locationRequirement"
    | "isFeatured"
  >;
  organization: Pick<
    typeof OrganizationTable.$inferSelect,
    "name" | "imageUrl"
  >;
}) => {
  const nameInitials = organization?.name
    .split(" ")
    .splice(0, 4)
    .map((word) => word[0])
    .join("");

  return (
    <Card
      className={cn(
        "@container",
        jobListing.isFeatured && "border-featured bg-featured/20"
      )}
    >
      <CardHeader>
        <div className="flex gap-4">
          <Avatar className="size-14 @max-sm:hidden">
            <AvatarImage
              src={organization.imageUrl ?? undefined}
              alt={organization.name}
            />
            <AvatarFallback className="uppercase bg-primary text-primary-foreground">
              {nameInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">{jobListing.title}</CardTitle>
            <CardDescription className="text-base">
              {organization.name}
            </CardDescription>
            {jobListing.postedAt != null && (
              <div className="text-sm font-medium text-primary @min-md:hidden">
                <Suspense fallback={jobListing.postedAt.toLocaleDateString()}>
                  <DaysSincePosting postedAt={jobListing.postedAt} />
                </Suspense>
              </div>
            )}
          </div>

          {jobListing.postedAt != null && (
            <div className="text-sm font-medium text-primary ml-auto @max-md:hidden">
              <Suspense fallback={jobListing.postedAt.toLocaleDateString()}>
                <DaysSincePosting postedAt={jobListing.postedAt} />
              </Suspense>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <JobListingBadges
          jobListing={jobListing}
          className={jobListing.isFeatured ? "border-primary/35" : undefined}
        />
      </CardContent>
    </Card>
  );
};

const DaysSincePosting = async ({ postedAt }: { postedAt: Date }) => {
  await connection();
  const daysSincePosted = differenceInDays(postedAt, Date.now());

  if (daysSincePosted === 0) {
    return <Badge>New</Badge>;
  }

  return new Intl.RelativeTimeFormat(undefined, {
    style: "narrow",
    numeric: "always",
  }).format(daysSincePosted, "days");
};

const getJobListings = async (
  searchParams: z.infer<typeof searchParamsSchema>,
  jobListingId: string | undefined
) => {
  "use cache";
  cacheTag(getJobListingGlobalTag());

  const { title, city, locationRequirement, type, jobIds, state, experience } =
    searchParams;

  const whereConditions: (SQL | undefined)[] = [];

  if (title) {
    whereConditions.push(ilike(JobListingTable.title, `%${title}%`));
  }

  if (city) {
    whereConditions.push(ilike(JobListingTable.city, `%${city}%`));
  }

  if (locationRequirement) {
    whereConditions.push(
      eq(JobListingTable.locationRequirement, locationRequirement)
    );
  }

  if (state) {
    whereConditions.push(eq(JobListingTable.stateAbbreviation, state));
  }

  if (type) {
    whereConditions.push(eq(JobListingTable.type, type));
  }

  if (experience) {
    whereConditions.push(eq(JobListingTable.experienceLevel, experience));
  }

  if (jobIds && jobIds.length > 0) {
    whereConditions.push(
      or(...jobIds.map((jobId) => eq(JobListingTable.id, jobId)))
    );
  }

  const data = await db.query.JobListingTable.findMany({
    where: or(
      jobListingId
        ? and(
            eq(JobListingTable.status, "published"),
            eq(JobListingTable.id, jobListingId)
          )
        : undefined,
      and(eq(JobListingTable.status, "published"), ...whereConditions)
    ),
    with: {
      organization: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: [desc(JobListingTable.isFeatured), desc(JobListingTable.postedAt)],
  });

  data.forEach((listing) => {
    cacheTag(getOrganizationIdTag(listing.organization.id));
  });
  return data;
};
