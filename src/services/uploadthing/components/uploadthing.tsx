"use client";

import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";
import { CustomFileRouter } from "../router";
import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const UploadButtonComponent = generateUploadButton<CustomFileRouter>();
const UploadDropzoneComponent = generateUploadDropzone<CustomFileRouter>();

export const UploadDropzone = ({
  className,
  onClientUploadComplete,
  onUploadError,
  ...props
}: ComponentProps<typeof UploadDropzoneComponent>) => {
  return (
    <UploadDropzoneComponent
      {...props}
      className={cn(
        "border-2 border-dashed border-muted rounded-lg flex items-center justify-center",
        className
      )}
      onClientUploadComplete={(res) => {
        res.forEach(({ serverData }) => {
          toast.success(serverData.message);
        });
        onClientUploadComplete?.(res);
      }}
      onUploadError={(error) => {
        toast.error(error.message);
        onUploadError?.(error);
      }}
    />
  );
};
