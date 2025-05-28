import { BadmintonSession, Client } from "~/types/session";
import React from "react";
import Tag from "../components/common/Tag";

// 通用 Table 组件 Column 类型定义
export interface Column<T> {
  title: string;
  dataIndex: keyof T;
  render?: (value: unknown, record: T) => React.ReactNode;
}

const courseTypeColorMap: Record<string, string> = {
  "一对一": "bg-blue-100 text-blue-800",
  "一对二": "bg-green-100 text-green-800",
  "一对多": "bg-yellow-100 text-yellow-800",
  "夏令营": "bg-pink-100 text-pink-800",
  "开放式团课": "bg-purple-100 text-purple-800",
};

const clientTypeColorMap: Record<string, string> = {
  "青少年": "bg-cyan-100 text-cyan-800",
  "成人": "bg-orange-100 text-orange-800",
};

export const sessionColumns: Column<BadmintonSession>[] = [
  {
    title: "课程名称",
    dataIndex: "title",
  },
  {
    title: "课程类型",
    dataIndex: "sessionType",
    render: (value: unknown) => (
      <Tag color={courseTypeColorMap[String(value)] || "bg-gray-100 text-gray-800"}>{String(value)}</Tag>
    ),
  },
  { title: "教练", dataIndex: "coach" },
  { title: "场地", dataIndex: "courtName" },
  {
    title: "学员类型",
    dataIndex: "clientType",
    render: (value: unknown) => (
      <Tag color={clientTypeColorMap[String(value)] || "bg-gray-100 text-gray-800"}>{String(value)}</Tag>
    ),
  },
  {
    title: "学员",
    dataIndex: "clients",
    render: (value: unknown) => (
      <span>
        {Array.isArray(value)
          ? (value as Client[]).map((client: Client) => (client && client.name ? client.name : '')).join('，')
          : ''}
      </span>
    ),
  },
  // 操作列建议在页面本地定义
];