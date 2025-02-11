"use server";
import { auth } from "@/app/(auth)/auth";
import { saveEvent } from "@/lib/db/queries";

import { type Event } from "../../../../lib/db/schema";

import { z } from "zod";
import { generateUUID } from "@/lib/utils";

const eventSchema = z.object({
  title: z.string({ required_error: "Title is required" }),
  description: z.string({ required_error: "Description is required" }),
  type: z.enum(["alert", "jira"], {
    required_error: "Please select an type to display.",
  }),
  status: z
    .enum(["open", "closed"], {
      required_error: "Please select an status to display.",
    })
    .optional(),
});

export async function createEvent(formData: FormData) {
  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    type: formData.get("type"),
  };

  const result = eventSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error.flatten() };
  } else {
    const session = await auth();

    if (session?.user && session.user.id) {
      const event = await saveEvent({
        id: generateUUID(),
        title: result.data.title,
        description: result.data.description,
        userId: session.user.id,
        type: "alert",
        status: "open",
        priority: "low",
      });

      if (event) {
        return { success: true };
      } else {
        return { success: false, error: "Failed to create event" };
      }
    }
    return { success: false, error: "User not found" };
  }
}
