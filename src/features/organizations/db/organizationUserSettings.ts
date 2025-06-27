import { db } from "@/drizzle/db";
import { OrganizationUserSettingsTable } from "@/drizzle/schema";
import { revalidateOrganizationUserSettingsCache } from "./cache/organizationUserSettings";
import { and, eq } from "drizzle-orm";

export const insertOrganizationUserSettings = async (
  settings: typeof OrganizationUserSettingsTable.$inferInsert
) => {
  await db
    .insert(OrganizationUserSettingsTable)
    .values(settings)
    .onConflictDoNothing();

  revalidateOrganizationUserSettingsCache(settings);
};

export const deleteOrganizationUserSettings = async ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  await db
    .delete(OrganizationUserSettingsTable)
    .where(
      and(
        eq(OrganizationUserSettingsTable.userId, userId),
        eq(OrganizationUserSettingsTable.organizationId, organizationId)
      )
    );

  revalidateOrganizationUserSettingsCache({ userId, organizationId });
};

export const updateOrganizationUserSettings = async (
  { userId, organizationId }: { userId: string; organizationId: string },
  settings: Partial<
    Omit<
      typeof OrganizationUserSettingsTable.$inferInsert,
      "userId" | "organizationId"
    >
  >
) => {
  await db
    .insert(OrganizationUserSettingsTable)
    .values({ userId, organizationId, ...settings })
    .onConflictDoUpdate({
      target: [
        OrganizationUserSettingsTable.userId,
        OrganizationUserSettingsTable.organizationId,
      ],
      set: settings,
    });

  revalidateOrganizationUserSettingsCache({ userId, organizationId });
};
