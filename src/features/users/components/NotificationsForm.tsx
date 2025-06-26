"use client";

import { UserNotificationSettingsTable } from "@/drizzle/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userNotificationSettingsSchema } from "../actions/schema";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { LoadingSwap } from "@/components/LoadingSwap";
import { toast } from "sonner";
import { updateUserNotificationSettings } from "../actions/actions";

export const NotificationsForm = ({
  notificationSettings,
}: {
  notificationSettings?: Pick<
    typeof UserNotificationSettingsTable.$inferSelect,
    "newJobEmailNotifications" | "aiPrompt"
  >;
}) => {
  const form = useForm({
    resolver: zodResolver(userNotificationSettingsSchema),
    defaultValues: notificationSettings ?? {
      newJobEmailNotifications: false,
      aiPrompt: "",
    },
  });

  const onSubmit = async (
    data: z.infer<typeof userNotificationSettingsSchema>
  ) => {
    const result = await updateUserNotificationSettings(data);

    if (result.error) {
      toast.error(result.message);
    } else {
      toast.success(result.message);
    }
  };

  const newJobEmailNotifications = form.watch("newJobEmailNotifications");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="border rounded-lg p-4 shadow-sm space-y-6">
          <FormField
            name="newJobEmailNotifications"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Daily Email Notifications</FormLabel>
                    <FormDescription>
                      Receive emails about new job listings that match your
                      interest
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {newJobEmailNotifications && (
            <FormField
              name="aiPrompt"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-0.5">
                    <FormLabel>Filter Prompt</FormLabel>
                    <FormDescription>
                      Our AI will use this prompt to filter job listings and
                      only send you notifications for jobs that match your
                      criteria.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      className="min-h-32 resize-none"
                      rows={12}
                      placeholder="Describe the jobs you're interested in. For example: 'I'm looking for remote frontend development positions that use React and pay at least $100k per year.'"
                    />
                  </FormControl>
                  <FormDescription>
                    Leave blank to receive notifications for all new job
                    listings.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Button
          disabled={form.formState.isSubmitting}
          className="w-full cursor-pointer"
          type="submit"
        >
          <LoadingSwap isLoading={form.formState.isSubmitting}>
            Save Notification Settings
          </LoadingSwap>
        </Button>
      </form>
    </Form>
  );
};
