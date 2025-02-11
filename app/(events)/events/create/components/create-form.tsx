"use client";

import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { toast } from "@/hooks/use-toast";

import { toast } from "sonner";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createEvent } from "../actions";
import Link from "next/link";
import { redirect } from "next/navigation";

const alertsFormSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string({ required_error: "Description is required" }),
  type: z.enum(["alert", "jira"], {
    required_error: "Please type an status to display.",
  }),
  //   status: z.enum(["open", "closed"], {
  //     required_error: "Please select an status to display.",
  //   }),
});

type AlertsFormValues = z.infer<typeof alertsFormSchema>;

export default function CreateForm() {
  const form = useForm<AlertsFormValues>({
    resolver: zodResolver(alertsFormSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "alert",
    },
  });

  const [submitDisabled, setSubmitDisabled] = useState(false);

  async function onSubmit(data: AlertsFormValues) {
    setSubmitDisabled(true);

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description); // Do something with the form values.
    formData.append("type", data.type);

    const result = await createEvent(formData);
    if (result.success) {
      toast.success("Event created successfully");
      //   toast({
      //     title: "You submitted the following values:",
      //     description: (
      //       <div>
      //         <pre className="mt-2 mb-1 w-[340px] rounded-md bg-slate-950 p-4">
      //           <code className="text-white">
      //             {JSON.stringify(data, null, 2)}
      //           </code>
      //         </pre>
      //         <Button asChild>
      //           <Link href="/alerts">Go to Alerts Page</Link>
      //         </Button>
      //       </div>
      //     ),
      //   });
      setSubmitDisabled(false);
      setTimeout(() => {
        redirect("/events/list");
      }, 1000);
    } else {
      console.log(result.error);
      //   toast({
      //     title: "Failed to create event",
      //     description: result.error.map((error) => error.message).join(", "),
      //   });
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Create Alert</CardTitle>
          <CardDescription>Create a new alert.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>티켓 이름</FormLabel>
                    <FormControl>
                      <Input
                        required
                        placeholder="이벤트 이름"
                        type="text"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="alert">Alert</SelectItem>
                        <SelectItem value="jira">Jira</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      You can choose the type of alert to display.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>이벤트 설명</FormLabel>
                    <FormControl>
                      <Input
                        className="w-full"
                        type="text"
                        required
                        placeholder="이벤트 설명"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={submitDisabled}
                variant="outline"
                className="w-full"
              >
                추가
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </div>
  );
}
