import { db } from "@/drizzle/db";
import { UserTable } from "@/drizzle/schema";
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

const getUser = async (id: string) => {
  "use cache";
  cacheTag(getUserIdTag(id));

  const [user] = await db.select().from(UserTable).where(eq(UserTable.id, id));
  return user;
};
