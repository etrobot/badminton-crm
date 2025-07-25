import dayjs from "dayjs";
import { mockSessions, mockStudents } from "~/mock/sessions";
import { Button } from "~/components/ui/button";
import CRMTable, { Column } from "~/components/common/CRMTable";
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "@remix-run/react";
import CRMFilter from "~/components/common/CRMFilter";
import { SquarePenIcon,CirclePlusIcon } from 'lucide-react';
import { BadmintonSession } from "~/types/session";
import { sessionColumns as configSessionColumns } from "~/config/sessionColumns";


const SessionTable: React.FC = () => {
  const [data, setData] = useState(mockSessions.sort((a, b) => {
    const dateA = dayjs(a.dateTime);
    const dateB = dayjs(b.dateTime);
    return dateB.diff(dateA);
  }));

  // Extract unique options from mockSessions
  const uniqueCoaches = Array.from(new Set(mockSessions.map(session => session.coach))).map(coach => ({ label: coach, value: coach }));
  const uniqueCourtNames = Array.from(new Set(mockSessions.map(session => session.courtName))).map(courtName => ({ label: courtName, value: courtName }));
  // 生成所有课程涉及的学员姓名
  const uniqueStudents = Array.from(
    new Set(
      mockSessions
        .flatMap(session => session.students)
        .map(studentId => {
          const student = mockStudents.find(s => s.id === studentId);
          return student?.name;
        })
        .filter(Boolean)
    )
  ).map(clientName => ({ label: clientName!, value: clientName! }));
  const uniqueSessionTypes = Array.from(new Set(mockSessions.map(session => session.sessionType))).map(sessionType => ({ label: sessionType, value: sessionType }));
  const uniqueTitles = Array.from(new Set(mockSessions.map(session => session.title))).map(title => ({ label: title, value: title }));
  const uniqueFeePerStudents = Array.from(new Set(mockSessions.map(session => session.feePerStudent))).map(fee => ({ label: `￥${fee}`, value: fee.toString() }));

  // 搜索字段配置
  const filterConfigs: {
    name: string;
    label: string;
    type: 'text' | 'select';
    options?: { label: string; value: string }[];
  }[] = [
    {
      name: "title",
      label: "课程名",
      type: "select",
      options: uniqueTitles
    },
    {
      name: "coach",
      label: "教练",
      type: "select",
      options: uniqueCoaches
    },
    {
      name: "courtName",
      label: "场地",
      type: "select",
      options: uniqueCourtNames
    },
    {
      name: "students", // Add students filter
      label: "学员",
      type: "select",
      options: uniqueStudents
    },
    {
      name: "sessionType",
      label: "课程类型",
      type: "select",
      options: uniqueSessionTypes,
    },
    {
      name: "feePerStudent",
      label: "单人学费",
      type: "select",
      options: uniqueFeePerStudents,
    },
  ];

  // 查询逻辑
  const handleQuery = (queryFilters: Record<string, string | string[]>) => {
    console.log('[SessionTable] 查询入参', queryFilters);
    const filtered = mockSessions.filter((item) => {
      if (queryFilters.title && (queryFilters.title as string[]).length > 0 && !(queryFilters.title as string[]).includes(item.title)) return false;
      if (queryFilters.coach && (queryFilters.coach as string[]).length > 0 && !(queryFilters.coach as string[]).includes(item.coach)) return false;
      if (queryFilters.courtName && (queryFilters.courtName as string[]).length > 0 && !(queryFilters.courtName as string[]).includes(item.courtName)) return false;
      if (queryFilters.sessionType && (queryFilters.sessionType as string[]).length > 0 && !(queryFilters.sessionType as string[]).includes(item.sessionType)) return false;
      if (queryFilters.students && (queryFilters.students as string[]).length > 0) {
        const selectedStudents = queryFilters.students as string[];
        const sessionStudentNames = item.students
          .map(studentId => {
            const student = mockStudents.find(s => s.id === studentId);
            return student?.name;
          })
          .filter(Boolean);
        if (!selectedStudents.some(selectedClient => sessionStudentNames.includes(selectedClient))) return false;
      }
      if (queryFilters.feePerStudent && (queryFilters.feePerStudent as string[]).length > 0) {
        const selectedFees = queryFilters.feePerStudent as string[];
        if (!selectedFees.includes(item.feePerStudent.toString())) return false;
      }
      return true;
    });
    console.log('[SessionTable] 查询结果', filtered);
    setData(filtered);
  };

  // 重置逻辑
  const handleReset = () => {
    console.log('[SessionTable] 重置');
    setData(mockSessions);
  };

  // 定义 columns 配置
  const columns: Column<BadmintonSession>[] = [
    ...configSessionColumns,
    {
      title: "操作",
      dataIndex: "actions", // Using a placeholder dataIndex as actions are not part of the data structure
      render: (_, record) => (
        <Link to={`/sessions/edit/${record.id}`}>
          <Button size='sm' variant="outline" onClick={() => {
            console.log('[SessionTable] 跳转编辑页面', record);
          }}>
            <SquarePenIcon className="mr-2 h-4 w-4" /> 编辑
          </Button>
        </Link>
      ),
    },
  ];

  const location = useLocation();
  const isMainPage = location.pathname === "/sessions";
  console.log('[SessionTable] 当前路径', location.pathname, 'isMainPage:', isMainPage);

  return (
    <>
      {isMainPage && (
        <div className="min-h-screen bg-background p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">课程管理</h1>
              <Link to="/sessions/new">
                <Button onClick={() => {
                  console.log('[SessionTable] 跳转新增页面');
                }}><CirclePlusIcon/>添加课程</Button>
              </Link>
            </div>
            <div className="my-4">
              <CRMFilter configs={filterConfigs} onQuery={handleQuery} onReset={handleReset} />
            </div>
            <CRMTable sessions={data} columns={columns}/>
          </div>
        </div>
      )}
      <Outlet />
    </>
  );
};

export default SessionTable;