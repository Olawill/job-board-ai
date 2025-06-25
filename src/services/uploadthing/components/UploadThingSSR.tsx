import { connection } from "next/server";
import { extractRouterConfig } from "uploadthing/server";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";

import { customFileRouter } from "../router";
import { Suspense } from "react";

export const UploadThingSSR = () => {
  return (
    <Suspense>
      <UTSSR />
    </Suspense>
  );
};

const UTSSR = async () => {
  await connection();

  return <NextSSRPlugin routerConfig={extractRouterConfig(customFileRouter)} />;
};
