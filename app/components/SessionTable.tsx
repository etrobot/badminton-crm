import React, { useState } from "react";
import { mockSessions } from "~/mock/sessions";
import { Button } from "~/components/ui/button";
import { BadmintonSession } from "~/types/session";
import CRMTable from "~/components/common/CRMTable";
import CRMModal, { CRMModalField } from "~/components/common/CRMModal";

// 通用 Table 组件 Column 类型定义
interface Column<T> {
  title: string;
  dataIndex: keyof T;
  render?: (value: T[keyof T], record: T) => React.ReactNode;
}

// 课程表单字段定义
const sessionFields: CRMModalField[] = [
  { label: "课程信息", name: "title", type: "text", required: true },
  { label: "教练", name: "coach", type: "text", required: true },
  { label: "场地", name: "courtName", type: "text", required: true },
  { label: "时间", name: "dateTime", type: "datetime-local", required: true },
  { label: "课程类型", name: "sessionType", type: "select", required: true, options: [
    { label: "一对一", value: "一对一" },
    { label: "一对二", value: "一对二" },
    { label: "一对多", value: "一对多" },
    { label: "开放式团课", value: "开放式团课" },
  ]},
  { label: "备注", name: "remark", type: "text" },
];

// 默认初始数据
const defaultSessionData = {
  title: '',
  coach: '',
  courtName: '',
  dateTime: '',
  sessionType: '',
  remark: '',
};

const SessionTable: React.FC = () => {
  // State to control the visibility of the modal and store the session data for editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<BadmintonSession | null>(null);

  // Function to open the modal for adding a new session
  const handleAddSession = () => {
    console.log("handleAddSession 被调用");
    setEditingSession(null); // Reset editing session
    setIsModalOpen(true);
  };

  // Function to open the modal for editing an existing session
  const handleEditSession = (session: BadmintonSession) => {
    console.log("handleEditSession 入参:", session);
    setEditingSession(session);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    console.log("handleCloseModal 被调用");
    setIsModalOpen(false);
    setEditingSession(null); // Clear editing session data
  };

  // Function to handle form submission (add or edit session)
  const handleSessionSubmit = (session: Record<string, string | number>) => {
    console.log("handleSessionSubmit 入参:", session);
    // 这里可以加更多日志
    handleCloseModal();
    console.log("handleSessionSubmit 结束，弹窗已关闭");
  };

  // 定义 columns 配置
  const columns: Column<BadmintonSession & { actions?: React.ReactNode }>[] = [
    { title: "课程信息", dataIndex: "title" },
    { title: "教练", dataIndex: "coach" },
    { title: "场地", dataIndex: "courtName" },
    {
      title: "学员",
      dataIndex: "clients",
      render: (value) => {
        return (
          <span>
            {Array.isArray(value)
              ? value.map(client => (client as { name: string }).name).join("，")
              : ""}
          </span>
        );
      }
    },
    {
      title: "操作",
      dataIndex: "actions",
      render: (_: unknown, record: BadmintonSession) => (
        <button onClick={() => handleEditSession(record)}>编辑</button>
      ),
    },
  ];

  console.log("SessionTable 渲染, isModalOpen:", isModalOpen, "editingSession:", editingSession);

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">课程管理</h1>
          <Button onClick={handleAddSession}>添加课程</Button>
        </div>
        <CRMTable sessions={mockSessions} columns={columns} onEdit={handleEditSession} />
        <CRMModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSessionSubmit}
          fields={sessionFields}
          initialData={editingSession ? {
            title: editingSession.title || '',
            coach: editingSession.coach || '',
            courtName: editingSession.courtName || '',
            dateTime: editingSession.dateTime || '',
            sessionType: editingSession.sessionType || '',
            remark: 'remark' in editingSession ? (editingSession as { remark?: string }).remark || '' : '',
          } : defaultSessionData}
          title={editingSession ? '编辑课程' : '新增课程'}
        />
      </div>
    </div>
  );
};

export default SessionTable; 