import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getUserNotificationSettingGlobalTag = () => {
  return getGlobalTag("userNotificationSettings");
};

export const getUserNotificationSettingIdTag = (userId: string) => {
  return getIdTag("userNotificationSettings", userId);
};

export const revalidateUserNotificationSettingCache = (userId: string) => {
  revalidateTag(getUserNotificationSettingGlobalTag());
  revalidateTag(getUserNotificationSettingIdTag(userId));
};
