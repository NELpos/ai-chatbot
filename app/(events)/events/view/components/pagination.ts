"use client";
import * as React from "react";

export type Pagination = {
  pageIndex: number;
  pageSize: number;
};

export const usePagination = () => {
  const [pagination, setPagination] = React.useState<Pagination>({
    pageIndex: 0,
    pageSize: 10,
  });

  const onPaginationChange = (pageIndex: number) => {
    setPagination((prev) => {
      return {
        ...prev,
        pageIndex,
      };
    });
  };

  const onPageSizeChange = (pageSize: number) => {
    setPagination((prev) => {
      return {
        ...prev,
        pageSize,
      };
    });
  };

  return {
    pagination,
    onPaginationChange: onPaginationChange,
    onPageSizeChange: onPageSizeChange,
  };
};
