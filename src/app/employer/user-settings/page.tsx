import { Suspense } from "react";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { OrganizationUserSettingsTable } from "@/drizzle/schema";
import {
  getCurrentOrganization,
  getCurrentUser,
} from "@/services/clerk/lib/getCurrentAuth";

import { OrgNotificationsForm } from "@/features/organizations/components/OrgNotificationsForm";

import { Card, CardContent } from "@/components/ui/card";
import { getOrganizationUserSettingsIdTag } from "@/features/organizations/db/cache/organizationUserSettings";

const EmployerUserSettingsPage = () => {
  return (
    <Suspense>
      <SuspendedComponent />
    </Suspense>
  );
};

const SuspendedComponent = async () => {
  const { userId } = await getCurrentUser();
  const { orgId } = await getCurrentOrganization();

  if (userId == null || orgId == null) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <SuspendedForm userId={userId} organizationId={orgId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

const SuspendedForm = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  const notificationSettings = await getNotificationSettings({
    userId,
    organizationId,
  });

  return <OrgNotificationsForm notificationSettings={notificationSettings} />;
};

const getNotificationSettings = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  "use cache";
  cacheTag(getOrganizationUserSettingsIdTag({ userId, organizationId }));

  return db.query.OrganizationUserSettingsTable.findFirst({
    where: and(
      eq(OrganizationUserSettingsTable.userId, userId),
      eq(OrganizationUserSettingsTable.organizationId, organizationId)
    ),
    columns: { newApplicationEmailNotifications: true, minimumRating: true },
  });
};

export default EmployerUserSettingsPage;
