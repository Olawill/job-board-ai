import { Card, CardContent } from "@/components/ui/card";
import { JobListingForm } from "@/features/jobListings/components/JobListingForm";
import { getCurrentOrganization } from "@/services/clerk/lib/getCurrentAuth";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getJobListing } from "../page";

type Props = {
  params: Promise<{ jobListingId: string }>;
};

const EditJobListingPage = (props: Props) => {
  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-2">Edit Job Listing</h1>
      <p className="text-muted-foreground mb-6">
        This does not post the listing yet, it just saves a draft.
      </p>
      <Card>
        <CardContent>
          <Suspense>
            <SuspendedPage {...props} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

const SuspendedPage = async ({ params }: Props) => {
  const { jobListingId } = await params;
  const { orgId } = await getCurrentOrganization();

  if (orgId == null) return notFound();

  const jobListing = await getJobListing(jobListingId, orgId);

  if (jobListing == null) return notFound();

  return <JobListingForm jobListing={jobListing} />;
};

export default EditJobListingPage;
