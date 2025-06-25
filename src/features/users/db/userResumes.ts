import { db } from "@/drizzle/db";
import { UserResumeTable } from "@/drizzle/schema";
import { revalidateUserResumeCache } from "./cache/userResumes";
import { eq } from "drizzle-orm";

export const upsertUserResume = async (
  userId: string,
  data: Omit<typeof UserResumeTable.$inferInsert, "userId">
) => {
  await db
    .insert(UserResumeTable)
    .values({ userId, ...data })
    .onConflictDoUpdate({
      target: UserResumeTable.userId,
      set: data,
    });

  revalidateUserResumeCache(userId);
};

export const updateUserResume = async (
  userId: string,
  data: Partial<Omit<typeof UserResumeTable.$inferInsert, "userId">>
) => {
  await db
    .update(UserResumeTable)
    .set(data)
    .where(eq(UserResumeTable.userId, userId));

  revalidateUserResumeCache(userId);
};
