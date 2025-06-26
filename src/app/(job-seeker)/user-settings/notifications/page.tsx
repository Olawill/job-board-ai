import { Suspense } from "react";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

import { db } from "@/drizzle/db";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { UserNotificationSettingsTable } from "@/drizzle/schema";
import { getCurrentUser } from "@/services/clerk/lib/getCurrentAuth";

import { NotificationsForm } from "@/features/users/components/NotificationsForm";
import { getUserNotificationSettingIdTag } from "@/features/users/db/cache/userNotificationSettings";

import { Card, CardContent } from "@/components/ui/card";

const UserNotificationsPage = () => {
  return (
    <Suspense>
      <SuspendedComponent />
    </Suspense>
  );
};

const SuspendedComponent = async () => {
  const { userId } = await getCurrentUser();

  if (userId == null) return notFound();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Notification Settings</h1>
      <Card>
        <CardContent>
          <Suspense fallback={<LoadingSpinner />}>
            <SuspendedForm userId={userId} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
};

const SuspendedForm = async ({ userId }: { userId: string }) => {
  const notificationSettings = await getNotificationSettings(userId);

  return <NotificationsForm notificationSettings={notificationSettings} />;
};

const getNotificationSettings = async (userId: string) => {
  "use cache";
  cacheTag(getUserNotificationSettingIdTag(userId));

  return db.query.UserNotificationSettingsTable.findFirst({
    where: eq(UserNotificationSettingsTable.userId, userId),
    columns: { newJobEmailNotifications: true, aiPrompt: true },
  });
};

export default UserNotificationsPage;
