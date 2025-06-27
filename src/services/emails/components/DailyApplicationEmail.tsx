import { JobListingApplicationTable } from "@/drizzle/schema";
import {
  Container,
  Head,
  Heading,
  Html,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import tailwindConfig from "../data/tailwindConfig";
import { cn } from "@/lib/utils";

type Application = Pick<
  typeof JobListingApplicationTable.$inferSelect,
  "rating"
> & {
  userName: string;
  organizationId: string;
  organizationName: string;
  jobListingId: string;
  jobListingTitle: string;
};

const DailyApplicationEmail = ({
  userName,
  applications,
}: {
  userName: string;
  applications: Application[];
}) => {
  return (
    <Tailwind config={tailwindConfig}>
      <Html>
        <Head />
        <Container className="font-sans">
          <Heading as="h1">New Applications!</Heading>

          <Text>
            Hi {userName}. <br />
            <br />
            Here are all the new applications for your job listings.
          </Text>

          {Object.entries(
            Object.groupBy(applications, (a) => a.organizationId)
          ).map(([orgId, orgApplications], i) => {
            if (orgApplications == null || orgApplications.length === 0) {
              return null;
            }

            return (
              <OrganizationSection
                key={orgId}
                orgName={orgApplications[0].organizationName}
                applications={orgApplications}
                noMargin={i === 0}
              />
            );
          })}
        </Container>
      </Html>
    </Tailwind>
  );
};

const OrganizationSection = ({
  orgName,
  applications,
  noMargin,
}: {
  orgName: string;
  applications: Application[];
  noMargin?: boolean;
}) => {
  return (
    <Section className={noMargin ? undefined : "mt-8"}>
      <Heading as="h2" className="leading-none font-semibold text-3xl my-4">
        {orgName}
      </Heading>

      {Object.entries(Object.groupBy(applications, (a) => a.jobListingId)).map(
        ([jobListingId, listingApplications], i) => {
          if (listingApplications == null || listingApplications.length === 0) {
            return null;
          }
          return (
            <JobListingCard
              key={jobListingId}
              jobListingTitle={listingApplications[0].jobListingTitle}
              applications={listingApplications}
              noMargin={i === 0}
            />
          );
        }
      )}
    </Section>
  );
};

const JobListingCard = ({
  jobListingTitle,
  applications,
  noMargin,
}: {
  jobListingTitle: string;
  applications: Application[];
  noMargin?: boolean;
}) => {
  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-lg border p-4 border-primary border-solid",
        !noMargin && "mt-6"
      )}
    >
      <Heading as="h3" className="leading-none font-semibold text-xl mb-3 mt-0">
        {jobListingTitle}
      </Heading>

      {applications.map((application, i) => (
        <Text key={i} className="mt-2 mb-0">
          <span>{application.userName}: </span>
          <RatingIcons rating={application.rating} />
        </Text>
      ))}
    </div>
  );
};

const RatingIcons = ({ rating }: { rating: number | null }) => {
  if (rating == null || rating < 1 || rating > 5) {
    return "Unrated";
  }

  const stars: React.ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className="w-3 -mb-[7px] mr-0.5">
        {rating >= i ? "★" : "☆"}
      </span>
    );
  }

  return stars;
};

DailyApplicationEmail.PreviewProps = {
  userName: "Job Tester",
  applications: [
    {
      rating: 5,
      userName: "Alice Johnson",
      organizationId: "org-001",
      organizationName: "Acme Corp",
      jobListingId: "job-001",
      jobListingTitle: "Frontend Engineer",
    },
    {
      rating: 3,
      userName: "Bob Smith",
      organizationId: "org-002",
      organizationName: "Beta LLC",
      jobListingId: "job-002",
      jobListingTitle: "Backend Developer",
    },
    {
      rating: null,
      userName: "Carol Lee",
      organizationId: "org-003",
      organizationName: "Gamma Inc",
      jobListingId: "job-003",
      jobListingTitle: "Product Manager",
    },
    {
      rating: 4,
      userName: "David Kim",
      organizationId: "org-004",
      organizationName: "Delta Tech",
      jobListingId: "job-004",
      jobListingTitle: "UX Designer",
    },
    {
      rating: 2,
      userName: "Eva Green",
      organizationId: "org-005",
      organizationName: "Epsilon Group",
      jobListingId: "job-005",
      jobListingTitle: "DevOps Engineer",
    },
    {
      rating: 4,
      userName: "Frank Nguyen",
      organizationId: "org-001",
      organizationName: "Acme Corp",
      jobListingId: "job-001",
      jobListingTitle: "Frontend Engineer",
    },
    {
      rating: 5,
      userName: "Grace Kim",
      organizationId: "org-002",
      organizationName: "Beta LLC",
      jobListingId: "job-006",
      jobListingTitle: "Full Stack Developer",
    },
    {
      rating: 3,
      userName: "Henry Zhao",
      organizationId: "org-002",
      organizationName: "Beta LLC",
      jobListingId: "job-006",
      jobListingTitle: "Full Stack Developer",
    },
    {
      rating: 1,
      userName: "Isabel Ortega",
      organizationId: "org-003",
      organizationName: "Gamma Inc",
      jobListingId: "job-007",
      jobListingTitle: "Technical Writer",
    },
    {
      rating: null,
      userName: "Jack Liu",
      organizationId: "org-002",
      organizationName: "Beta LLC",
      jobListingId: "job-002",
      jobListingTitle: "Backend Developer",
    },
  ],
} satisfies Parameters<typeof DailyApplicationEmail>[0];

export default DailyApplicationEmail;
