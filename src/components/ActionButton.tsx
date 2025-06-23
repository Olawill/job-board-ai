"use client";

import { ComponentPropsWithRef, useTransition } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { LoadingSwap } from "./LoadingSwap";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export const ActionButton = ({
  action,
  requireAreYouSure = false,
  areYouSureDescription = "This action cannot be undone",
  ...props
}: Omit<ComponentPropsWithRef<typeof Button>, "onClick"> & {
  action: () => Promise<{ error: boolean; message: string }>;
  requireAreYouSure?: boolean;
  areYouSureDescription?: string;
}) => {
  const [isLoading, startTransition] = useTransition();

  const performAction = () => {
    startTransition(async () => {
      const data = await action();
      if (data.error) {
        toast.error(data.message ?? "Error");
      }
    });
  };

  if (requireAreYouSure) {
    return (
      <AlertDialog open={isLoading ? true : undefined}>
        <AlertDialogTrigger asChild>
          <Button {...props} className="cursor-pointer" />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {areYouSureDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={performAction}>
              <LoadingSwap isLoading={isLoading} className="cursor-pointer">
                Yes
              </LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Button
      {...props}
      disabled={isLoading}
      onClick={performAction}
      className="cursor-pointer"
    >
      <LoadingSwap
        isLoading={isLoading}
        className="inline-flex items-center gap-2"
      >
        {props.children}
      </LoadingSwap>
    </Button>
  );
};
