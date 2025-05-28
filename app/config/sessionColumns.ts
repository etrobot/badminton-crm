import { BadmintonSession, Client } from "~/types/session";
import React from "react";

// 通用 Table 组件 Column 类型定义
export interface Column<T> {
  title: string;
  dataIndex: keyof T;
  render?: (value: unknown, record: T) => React.ReactNode;
}

export const sessionColumns: Column<BadmintonSession>[] = [
  {
    title: "课程名称",
    dataIndex: "title",
  },
  { title: "教练", dataIndex: "coach" },
  { title: "场地", dataIndex: "courtName" },
  {
    title: "学员",
    dataIndex: "clients",
    render: (value: unknown) => (
      React.createElement('span', null,
        Array.isArray(value)
          ? (value as Client[]).map((client: Client) => (client && client.name ? client.name : '')).join('，')
          : ''
      )
    )
  },
  // 操作列建议在页面本地定义
];