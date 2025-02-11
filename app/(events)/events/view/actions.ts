"use server";

import { getTotal, getEvents } from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";

export async function getWrapTotal(queryConditions: any) {
  const session = await auth();

  if (!session || !session.user) {
    return { count: 0 };
  }

  try {
    const rowCount = await getTotal({});
    return { count: rowCount };
  } catch (error) {
    console.error("Failed to get total from database");
    throw error;
  }
}

export async function getWrapEvents(options: {
  pageIndex: number;
  pageSize: number;
  queryConditions: any;
}) {
  const session = await auth();

  if (!session || !session.user) {
    return { events: [] };
  }

  try {
    const events = await getEvents(options);
    return { events: events };
  } catch (error) {
    console.error("Failed to get events from database");
    throw error;
  }
}

// // export async function updatePageSize(pageSize: number) {
// //   const session = await getSession();
// //   if (session.id) {
// //     await db.setting.update({
// //       where: { userId: session.id },
// //       data: { alertPageSize: pageSize },
// //     });
// //   }
// // }
