"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/LoadingSwap";
import { MarkdownEditor } from "@/components/markdown/MarkdownEditor";

import { createJobListingApplication } from "../actions/actions";
import { newJobListingApplicationSchema } from "../actions/schema";

export const NewJobListingApplicationForm = ({
  jobListingId,
}: {
  jobListingId: string;
}) => {
  const form = useForm({
    resolver: zodResolver(newJobListingApplicationSchema),
    defaultValues: {
      coverLetter: "",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof newJobListingApplicationSchema>
  ) => {
    const results = await createJobListingApplication(jobListingId, data);

    if (results.error) {
      toast.error(results.message);
      return;
    }

    toast.success(results.message);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          name="coverLetter"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <MarkdownEditor {...field} markdown={field.value ?? ""} />
              </FormControl>
              <FormDescription>Optional</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          disabled={form.formState.isSubmitting}
          className="w-full cursor-pointer"
          type="submit"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Apply
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};
