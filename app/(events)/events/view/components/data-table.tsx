"use client";
import * as React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  SortingState,
  VisibilityState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
  PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "@/app/(events)/events/view/components/data-table-pagination";
import { DataTableToolbar } from "@/app/(events)/events/view/components/data-table-toolbar";

import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Event } from "@/lib/db/schema";

import {
  //   fetchAlerts,
  //   getTotalRowCount,
  //   getPageSize,
  //   updatePageSize,
  getWrapTotal,
  getWrapEvents,
} from "@/app/(events)/events/view/actions";

import { BotMessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
// import { TableAIChat } from "@/app/(events)/events/list/components/table-ai-chat";
// import { QueryConditions } from "@/lib/ai/tools";

type QueryConditions = {
  type?: string;
  status?: string;
  priority?: string;
  title?: { contains: string };
  description?: { contains: string };
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initialPageSize: number;
}

function DraggableHeader({
  header,
  index,
  moveColumn,
}: {
  header: any;
  index: number;
  moveColumn: any;
}) {
  const [, drag] = useDrag({
    type: "COLUMN",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "COLUMN",
    hover(item: { index: number }) {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <TableHead
      ref={(node) => {
        if (node) {
          drag(drop(node));
        }
      }}
      className="cursor-move"
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
    </TableHead>
  );
}

export function DataTable<TData, TValue>({
  columns,
  initialPageSize,
}: // pagination,
DataTableProps<TData, TValue>) {
  //   const [isChatOpen, setIsChatOpen] = React.useState(false);

  //sorting
  const [sorting, setSorting] = React.useState<SortingState>([]);

  //column filters
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  //row selection
  const [rowSelection, setRowSelection] = React.useState({});

  //column visibility
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  //column order
  const [columnOrder, setColumnOrder] = React.useState<string[]>(() =>
    columns.map((c) => c.id!)
  );

  //pagination
  const [{ pageIndex, pageSize }, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: initialPageSize,
    });

  const [queryConditions, setQueryConditions] = React.useState<any>({});

  //alerts data
  const [alerts, setAlerts] = React.useState<Event[]>([]);

  //total rows
  const [totalRows, setTotalRows] = React.useState(0);

  const handleQueryConditionsChange = React.useCallback(
    (newQueryConditions: QueryConditions) => {
      setQueryConditions(newQueryConditions);
    },
    [setQueryConditions]
  );

  //fetch alerts
  const fetchData = React.useCallback(
    async (options: {
      pageIndex: number;
      pageSize: number;
      queryConditions: any;
    }) => {
      //Update page size in database
      //await updatePageSize(options.pageSize);

      const { events } = await getWrapEvents(options);
      const { count } = await getWrapTotal(options.queryConditions);
      console.log(totalRows);

      setAlerts(events);
      setTotalRows(count);
    },
    []
  );

  React.useEffect(() => {
    const fetchDataOptions = {
      pageIndex,
      pageSize,
      queryConditions,
    };
    fetchData(fetchDataOptions);
  }, [fetchData, pageIndex, pageSize, queryConditions]);

  const moveColumn = React.useCallback(
    (draggedColumnIndex: number, targetColumnIndex: number) =>
      setColumnOrder((prevOrder) => {
        const newOrder = [...prevOrder];
        const [draggedColumnId] = newOrder.splice(draggedColumnIndex, 1);
        newOrder.splice(targetColumnIndex, 0, draggedColumnId);
        return newOrder;
      }),
    []
  );

  const pagination = React.useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const table = useReactTable({
    data: alerts as TData[],
    columns,
    pageCount: Math.ceil(totalRows / pageSize),
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnOrderChange: setColumnOrder,
    manualPagination: true,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      columnOrder,
      pagination,
    },
    initialState: {
      columnOrder: columnOrder,
    },
  });

  React.useEffect(() => {
    setColumnOrder((prevOrder) => {
      const newOrder = [...prevOrder];
      Object.keys(columnVisibility).forEach((key) => {
        const isVisible = columnVisibility[key];
        const index = newOrder.indexOf(key);

        if (!isVisible && index !== -1) {
          // Remove the column if it's not visible
          newOrder.splice(index, 1);
        } else if (isVisible && index === -1) {
          // Add the column to the end if it's visible and not already in the order
          newOrder.push(key);
        }
      });
      return newOrder;
    });
  }, [columnVisibility]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full space-y-4 justify-center">
        <DataTableToolbar table={table} />
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {table.getHeaderGroups()[0].headers.map((header, index) => (
                  <DraggableHeader
                    key={header.id}
                    header={header}
                    index={index}
                    moveColumn={moveColumn}
                  />
                ))}
              </TableRow>
              {/* {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))} */}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DataTablePagination table={table} />
        {/* {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: 50 }}
            transition={{ duration: 0.5 }}
            className="fixed bottom-20 right-4"
          >
            <TableAIChat
              onClose={() => setIsChatOpen(false)}
              handleQueryConditionsChange={handleQueryConditionsChange}
            />
          </motion.div>
        )} */}
        {/* <Button
          className="fixed bottom-4 right-4"
          onClick={() => setIsChatOpen(!isChatOpen)}
        >
          <BotMessageSquare className="w-6 h-6" /> Chat with AI
        </Button> */}
      </div>
    </DndProvider>
  );
}
