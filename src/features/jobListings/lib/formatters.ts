import {
  ExperienceLevel,
  JobListingStatuses,
  JobListingType,
  LocationRequirement,
  WageInterval,
} from "@/drizzle/schema";

export const formatWageInterval = (interval: WageInterval) => {
  switch (interval) {
    case "hourly":
      return "Hour";
    case "yearly":
      return "Year";
    default:
      throw new Error(`Invalid wage interval: ${interval satisfies never}`);
  }
};

export const formatLocationRequirement = (location: LocationRequirement) => {
  switch (location) {
    case "remote":
      return "Remote";
    case "in-office":
      return "In Office";
    case "hybrid":
      return "Hybrid";
    default:
      throw new Error(
        `Unknown location requirement: ${location satisfies never}`
      );
  }
};

export const formatJobType = (type: JobListingType) => {
  switch (type) {
    case "internship":
      return "Internship";
    case "co-op":
      return "Co-op";
    case "contract":
      return "Contract";
    case "part-time":
      return "Part Time";
    case "full-time":
      return "Full Time";
    default:
      throw new Error(`Unknown job type: ${type satisfies never}`);
  }
};

export const formatExperienceLevel = (experience: ExperienceLevel) => {
  switch (experience) {
    case "junior":
      return "Junior";
    case "associate":
      return "Associate";
    case "intermediate":
      return "Intermediate";
    case "senior":
      return "Senior";
    default:
      throw new Error(
        `Invalid experience level: ${experience satisfies never}`
      );
  }
};

export const formatJobListingStatus = (status: JobListingStatuses) => {
  switch (status) {
    case "draft":
      return "Draft";
    case "published":
      return "Active";
    case "delisted":
      return "Delisted";
    default:
      throw new Error(`Invalid job listing status: ${status satisfies never}`);
  }
};

export const formatWage = (wage: number, wageInterval: WageInterval) => {
  const wageFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  });

  switch (wageInterval) {
    case "hourly":
      return `${wageFormatter.format(wage)} / hr`;
    case "yearly":
      return wageFormatter.format(wage);
    default:
      throw new Error(`Unknown wage interval: ${wageInterval satisfies never}`);
  }
};

export const formatJobListingLocation = ({
  stateAbbreviation,
  city,
}: {
  stateAbbreviation?: string | null;
  city?: string | null;
}) => {
  if (stateAbbreviation == null && city == null) return "None";

  const locationParts = [];

  if (city != null) locationParts.push(city);
  if (stateAbbreviation != null)
    locationParts.push(stateAbbreviation.toUpperCase());

  return locationParts.join(", ");
};
