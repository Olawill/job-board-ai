import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getOrganizationGlobalTag = () => {
  return getGlobalTag("organizations");
};

export const getOrganizationIdTag = (id: string) => {
  return getIdTag("organizations", id);
};

export const revalidateOrganizationCache = (id: string) => {
  revalidateTag(getOrganizationGlobalTag());
  revalidateTag(getOrganizationIdTag(id));
};
