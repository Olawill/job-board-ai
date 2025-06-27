import { serve } from "inngest/next";
import { inngest } from "@/services/inngest/client";
import {
  clerkCreateOrganization,
  clerkCreateOrgMembership,
  clerkCreateUser,
  clerkDeleteOrganization,
  clerkDeleteOrgMembership,
  clerkDeleteUser,
  clerkUpdateOrganization,
  clerkUpdateUser,
} from "@/services/inngest/functions/clerk";
import { createAISummaryOfUploadedResume } from "@/services/inngest/functions/resume";
import { rankApplication } from "@/services/inngest/functions/jobApplication";
import {
  prepareDailyOrganizationUserApplicationNotifications,
  prepareDailyUserJobListingNotifications,
  sendDailyOrganizationUserApplicationEmail,
  sendDailyUserJobListingEmail,
} from "@/services/inngest/functions/email";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    /* your functions will be passed here later! */
    clerkCreateUser,
    clerkUpdateUser,
    clerkDeleteUser,
    clerkCreateOrganization,
    clerkUpdateOrganization,
    clerkDeleteOrganization,
    clerkCreateOrgMembership,
    clerkDeleteOrgMembership,
    createAISummaryOfUploadedResume,
    rankApplication,
    prepareDailyUserJobListingNotifications,
    sendDailyUserJobListingEmail,
    prepareDailyOrganizationUserApplicationNotifications,
    sendDailyOrganizationUserApplicationEmail,
  ],
});
