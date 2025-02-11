"use client";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { ArrowUpDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { Event } from "@/lib/db/schema";

import { DataTableColumnHeader } from "@/app/(events)/events/view/components/data-table-column-header";
// import { DataTableRowActions } from "@/components/ui/data-table/data-table-row-actions";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type AlertSchema = {
//   id: number;
//   title: string;
//   status:
//     | "open"
//     | "ready"
//     | "investigating"
//     | "analysis"
//     | "pending"
//     | "notify"
//     | "closed"
//     | "review"
//     | "l3_escalation"
//     | "re_opened";
//   description: string;
//   type: "alert" | "jira";
// };

export const columns: ColumnDef<Event>[] = [
  {
    id: "select",
    accessorKey: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Title",
  },
  {
    id: "description",
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "priority",
    accessorKey: "priority",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Priority" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">{row.getValue("priority")}</div>
    ),
    meta: {
      filterVariant: "select",
    },
    enableSorting: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("status")}</div>,
    meta: {
      filterVariant: "select",
    },
    enableSorting: true,
  },
  {
    id: "type",
    accessorKey: "type",
    meta: {
      filterVariant: "select",
    },
    header: "Type",
  },
  {
    id: "user",
    accessorKey: "user.username",
    header: "Assignee",
  },
  // {
  //   accessorKey: "actions",
  //   cell: ({ row }) => {
  //     const alert = row.original;
  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(alert.id.toString())}
  //           >
  //             Copy payment ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View payment details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
];
