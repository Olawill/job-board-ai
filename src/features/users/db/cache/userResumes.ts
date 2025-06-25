import { getGlobalTag, getIdTag } from "@/lib/dataCache";
import { revalidateTag } from "next/cache";

export const getUserResumeGlobalTag = () => {
  return getGlobalTag("userResumes");
};

export const getUserResumeIdTag = (id: string) => {
  return getIdTag("userResumes", id);
};

export const revalidateUserResumeCache = (id: string) => {
  revalidateTag(getUserResumeGlobalTag());
  revalidateTag(getUserResumeIdTag(id));
};
