import { Suspense } from "react";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import {
  JobListingApplicationTable,
  JobListingStatuses,
  JobListingTable,
} from "@/drizzle/schema";

import { Badge } from "@/components/ui/badge";

import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { formatJobListingStatus } from "@/features/jobListings/lib/formatters";
import { getJobListingIdTag } from "@/features/jobListings/db/cache/jobListings";
import { JobListingBadges } from "@/features/jobListings/components/JobListingBadges";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  StarIcon,
  StarOffIcon,
  Trash2Icon,
} from "lucide-react";
import { MarkdownPartial } from "@/components/markdown/MarkdownPartial";
import { MarkdownRenderer } from "@/components/markdown/MarkdownRenderer";
import { AsyncIf } from "@/components/AsyncIf";
import { hasOrgUserPermission } from "../../../../services/clerk/lib/orgUserPermissions";
import { getNextJobListingStatus } from "@/features/jobListings/lib/utils";
import {
  hasReachedMaxFeaturedJobListings,
  hasReachedMaxPublishedJobListings,
} from "@/features/jobListings/lib/planFeatureHelpers";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ActionButton } from "@/components/ActionButton";
import {
  deleteJobListing,
  toggleJobListingFeatured,
  toggleJobListingStatus,
} from "@/features/jobListings/actions/actions";
import { Separator } from "@/components/ui/separator";
import { getJobListingApplicationJobListingTag } from "@/features/jobListingsApplications/db/cache/jobListingApplications";
import { getUserIdTag } from "@/features/users/db/cache/users";
import { getUserResumeIdTag } from "@/features/users/db/cache/userResumes";
import {
  ApplicationTable,
  SkeletonApplicationTable,
} from "@/features/jobListingsApplications/components/ApplicationTable";

type Props = {
  params: Promise<{ jobListingId: string }>;
};

const JobListingIdPage = (props: Props) => {
  return (
    <Suspense>
      <SuspendedPage {...props} />
    </Suspense>
  );
};

const SuspendedPage = async ({ params }: Props) => {
  const { orgId } = await getCurrentOrganization();

  if (orgId == null) return null;

  const { jobListingId } = await params;
  const jobListing = await getJobListing(jobListingId, orgId);

  if (jobListing == null) return notFound();

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 @container">
      <div className="flex items-center justify-between gap-4 @max-4xl:flex-col @max-4xl:items-start">
        <div className="">
          <h1 className="text-2xl font-bold tracking-tight">
            {jobListing.title}
          </h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge>{formatJobListingStatus(jobListing.status)}</Badge>
            <JobListingBadges jobListing={jobListing} />
          </div>
        </div>
        <div className="flex items-center gap-2 empty:-mt-4">
          <AsyncIf
            condition={() => hasOrgUserPermission("org:job_listings:update")}
          >
            <Button asChild variant="outline">
              <Link href={`/employer/job-listings/${jobListing.id}/edit`}>
                <EditIcon className="size-4" />
                Edit
              </Link>
            </Button>
          </AsyncIf>
          <StatusUpdateButton status={jobListing.status} id={jobListing.id} />
          {jobListing.status === "published" && (
            <FeaturedToggleButton
              id={jobListing.id}
              isFeatured={jobListing.isFeatured}
            />
          )}

          <AsyncIf
            condition={() => hasOrgUserPermission("org:job_listings:delete")}
          >
            <ActionButton
              variant="destructive"
              action={deleteJobListing.bind(null, jobListing.id)}
              requireAreYouSure
              areYouSureDescription="This action cannot be undone. This will permanently delete this job listing."
            >
              <Trash2Icon className="size-4" />
              Delete
            </ActionButton>
          </AsyncIf>
        </div>
      </div>

      <MarkdownPartial
        dialogMarkdown={<MarkdownRenderer source={jobListing.description} />}
        mainMarkdown={
          <MarkdownRenderer
            className="prose-sm"
            source={jobListing.description}
          />
        }
        dialogTitle="Description"
      />

      <Separator />
      <div className="space-y-6">
        <h2 className="font-semibold text-xl">Applications</h2>
        <Suspense fallback={<SkeletonApplicationTable />}>
          <Applications jobListingId={jobListingId} />
        </Suspense>
      </div>
    </div>
  );
};

const StatusUpdateButton = ({
  status,
  id,
}: {
  status: JobListingStatuses;
  id: string;
}) => {
  const button = (
    <ActionButton
      action={toggleJobListingStatus.bind(null, id)}
      variant="outline"
      className="cursor-pointer"
      requireAreYouSure={getNextJobListingStatus(status) === "published"}
      areYouSureDescription="This will immediately show this job listing to all users."
    >
      {statusToggleButtonText(status)}
    </ActionButton>
  );
  return (
    <AsyncIf
      condition={() => hasOrgUserPermission("org:job_listings:change_status")}
    >
      {getNextJobListingStatus(status) === "published" ? (
        <AsyncIf
          condition={async () => {
            const isMaxed = await hasReachedMaxPublishedJobListings();
            return !isMaxed;
          }}
          otherwise={
            <UpgradePopover
              buttonText={statusToggleButtonText(status)}
              popoverText="You must upgrade your plan to publish more job listings."
            />
          }
        >
          {button}
        </AsyncIf>
      ) : (
        button
      )}
    </AsyncIf>
  );
};

const FeaturedToggleButton = ({
  isFeatured,
  id,
}: {
  isFeatured: boolean;
  id: string;
}) => {
  const button = (
    <ActionButton
      action={toggleJobListingFeatured.bind(null, id)}
      variant="outline"
      className="cursor-pointer"
    >
      {featuredToggleButtonText(isFeatured)}
    </ActionButton>
  );
  return (
    <AsyncIf
      condition={() => hasOrgUserPermission("org:job_listings:change_status")}
    >
      {!isFeatured ? (
        <AsyncIf
          condition={async () => {
            const isMaxed = await hasReachedMaxFeaturedJobListings();
            return !isMaxed;
          }}
          otherwise={
            <UpgradePopover
              buttonText={featuredToggleButtonText(isFeatured)}
              popoverText="You must upgrade your plan to feature more job listings."
            />
          }
        >
          {button}
        </AsyncIf>
      ) : (
        button
      )}
    </AsyncIf>
  );
};

const UpgradePopover = ({
  buttonText,
  popoverText,
}: {
  buttonText: React.ReactNode;
  popoverText: React.ReactNode;
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="cursor-pointer">
          {buttonText}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col gap-2">
        {popoverText}
        <Button asChild>
          <Link href="/employer/pricing">Upgrade Plan</Link>
        </Button>
      </PopoverContent>
    </Popover>
  );
};

const statusToggleButtonText = (status: JobListingStatuses) => {
  switch (status) {
    case "delisted":
    case "draft":
      return (
        <>
          <EyeIcon className="size-4" />
          Publish
        </>
      );
    case "published":
      return (
        <>
          <EyeOffIcon className="size-4" />
          Delist
        </>
      );
    default:
      throw new Error(`Unknown status: ${status satisfies never}`);
  }
};

const featuredToggleButtonText = (isFeatured: boolean) => {
  if (isFeatured) {
    return (
      <>
        <StarOffIcon className="size-4" />
        Unfeature
      </>
    );
  }

  return (
    <>
      <StarIcon className="size-4" />
      Feature
    </>
  );
};

const Applications = async ({ jobListingId }: { jobListingId: string }) => {
  const applications = await getJobListingApplications(jobListingId);
  const canUpdateRating = await hasOrgUserPermission(
    "org:job_listings_applications:change_rating"
  );
  const canUpdateStage = await hasOrgUserPermission(
    "org:job_listings_applications:change_stage"
  );

  // console.log({ canUpdateRating, canUpdateStage });
  return (
    <ApplicationTable
      applications={applications.map((a) => ({
        ...a,
        user: {
          ...a.user,
          resume: a.user.resume
            ? {
                ...a.user.resume,
                markdownSummary: a.user.resume.aiSummary ? (
                  <MarkdownRenderer source={a.user.resume.aiSummary} />
                ) : null,
              }
            : null,
        },
        coverLetterMarkdown: a.coverletter ? (
          <MarkdownRenderer source={a.coverletter} />
        ) : null,
      }))}
      canUpdateRating={canUpdateRating}
      canUpdateStage={canUpdateStage}
    />
  );
};

export const getJobListing = async (id: string, orgId: string) => {
  "use cache";
  cacheTag(getJobListingIdTag(id));

  return await db.query.JobListingTable.findFirst({
    where: and(
      eq(JobListingTable.id, id),
      eq(JobListingTable.organizationId, orgId)
    ),
  });
};

const getJobListingApplications = async (jobListingId: string) => {
  "use cache";
  cacheTag(getJobListingApplicationJobListingTag(jobListingId));

  const data = await db.query.JobListingApplicationTable.findMany({
    where: eq(JobListingApplicationTable.jobListingId, jobListingId),
    columns: {
      coverletter: true,
      createdAt: true,
      stage: true,
      rating: true,
      jobListingId: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          name: true,
          imageUrl: true,
        },
        with: {
          resume: {
            columns: {
              resumeFileUrl: true,
              aiSummary: true,
            },
          },
        },
      },
    },
  });

  data.forEach(({ user }) => {
    cacheTag(getUserIdTag(user.id));
    cacheTag(getUserResumeIdTag(user.id));
  });

  return data;
};

export default JobListingIdPage;
