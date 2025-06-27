import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getOrganizationUserSettingsGlobalTag = () => {
  return getGlobalTag("organizationUserSettings");
};

export const getOrganizationUserSettingsIdTag = ({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) => {
  return getIdTag("organizationUserSettings", `${organizationId}-${userId}`);
};

export const revalidateOrganizationUserSettingsCache = (id: {
  userId: string;
  organizationId: string;
}) => {
  revalidateTag(getOrganizationUserSettingsGlobalTag());
  revalidateTag(getOrganizationUserSettingsIdTag(id));
};
