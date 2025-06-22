import { db } from "@/drizzle/db";
import { OrganizationTable, UserTable } from "@/drizzle/schema";
import { getOrganizationIdTag } from "@/features/organizations/db/cache/organizations";
import { getUserIdTag } from "@/features/users/db/cache/users";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export const getCurrentUser = async ({ allData = false } = {}) => {
  const { userId } = await auth();

  return {
    userId,
    user: allData && userId != null ? await getUser(userId) : undefined,
  };
};

export const getCurrentOrganization = async ({ allData = false } = {}) => {
  const { orgId } = await auth();

  return {
    orgId,
    organization:
      allData && orgId != null ? await getOrganization(orgId) : undefined,
  };
};

const getUser = async (id: string) => {
  "use cache";
  cacheTag(getUserIdTag(id));

  const [user] = await db.select().from(UserTable).where(eq(UserTable.id, id));

  return user;
};

const getOrganization = async (id: string) => {
  "use cache";
  cacheTag(getOrganizationIdTag(id));

  const [organization] = await db
    .select()
    .from(OrganizationTable)
    .where(eq(OrganizationTable.id, id));

  return organization;
};
