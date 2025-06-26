import { db } from "@/drizzle/db";
import { UserNotificationSettingsTable } from "@/drizzle/schema";
import { revalidateUserNotificationSettingCache } from "./cache/userNotificationSettings";

export const insertUserNotificationSettings = async (
  settings: typeof UserNotificationSettingsTable.$inferInsert
) => {
  await db
    .insert(UserNotificationSettingsTable)
    .values(settings)
    .onConflictDoNothing();

  revalidateUserNotificationSettingCache(settings.userId);
};

export const updateUserNotificationSettings = async (
  userId: string,
  settings: Partial<
    Omit<typeof UserNotificationSettingsTable.$inferInsert, "userId">
  >
) => {
  await db
    .insert(UserNotificationSettingsTable)
    .values({ userId, ...settings })
    .onConflictDoUpdate({
      target: UserNotificationSettingsTable.userId,
      set: settings,
    });

  revalidateUserNotificationSettingCache(userId);
};
