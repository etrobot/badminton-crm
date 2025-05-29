import { mockStudents } from "~/mock/sessions";
import { Button } from "~/components/ui/button";
import CRMTable, { Column } from "~/components/common/CRMTable";
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "@remix-run/react";
import CRMFilter from "~/components/common/CRMFilter";
import { SquarePenIcon, CirclePlusIcon } from 'lucide-react';
import { Student } from "~/types/session";

const StudentTable: React.FC = () => {
  const [data, setData] = useState(mockStudents);

  // 唯一选项
  const uniqueNames = Array.from(new Set(mockStudents.map(s => s.name))).map(name => ({ label: name, value: name }));
  const uniqueGenders = [
    { label: '男', value: 'male' },
    { label: '女', value: 'female' }
  ];
  const uniqueLevels = Array.from(new Set(mockStudents.map(s => s.level))).map(level => ({ label: `Lv${level}`, value: level.toString() }));

  // 搜索字段配置
  const filterConfigs: {
    name: string;
    label: string;
    type: 'text' | 'select';
    options?: { label: string; value: string }[];
  }[] = [
    {
      name: "name",
      label: "姓名",
      type: "select",
      options: uniqueNames
    },
    {
      name: "gender",
      label: "性别",
      type: "select",
      options: uniqueGenders
    },
    {
      name: "level",
      label: "等级",
      type: "select",
      options: uniqueLevels
    },
  ];

  // 查询逻辑
  const handleQuery = (queryFilters: Record<string, string | string[]>) => {
    console.log('[StudentTable] 查询入参', queryFilters);
    const filtered = mockStudents.filter((item) => {
      if (queryFilters.name && (queryFilters.name as string[]).length > 0 && !(queryFilters.name as string[]).includes(item.name)) return false;
      if (queryFilters.gender && (queryFilters.gender as string[]).length > 0 && !(queryFilters.gender as string[]).includes(item.gender)) return false;
      if (queryFilters.level && (queryFilters.level as string[]).length > 0 && !(queryFilters.level as string[]).includes(item.level.toString())) return false;
      return true;
    });
    console.log('[StudentTable] 查询结果', filtered);
    setData(filtered);
  };

  // 重置逻辑
  const handleReset = () => {
    console.log('[StudentTable] 重置');
    setData(mockStudents);
  };

  // 定义 columns 配置
  const columns: Column<Student>[] = [
    { title: "姓名", dataIndex: "name" },
    { title: "性别", dataIndex: "gender", render: (v) => v === 'male' ? '男' : '女' },
    { title: "生日", dataIndex: "birthday" },
    { title: "等级", dataIndex: "level", render: (v) => `Lv${v}` },
    { title: "预存款", dataIndex: "prePay", render: (v) => `￥${v}` },
    { title: "备注", dataIndex: "remark" },
    {
      title: "操作",
      dataIndex: "actions",
      render: (_, record) => (
        <Link to={`/students/edit/${record.id}`}>
          <Button size='sm' variant="outline" onClick={() => {
            console.log('[StudentTable] 跳转编辑页面', record);
          }}>
            <SquarePenIcon className="mr-2 h-4 w-4" /> 编辑
          </Button>
        </Link>
      ),
    },
  ];

  const location = useLocation();
  const isMainPage = location.pathname === "/students";
  console.log('[StudentTable] 当前路径', location.pathname, 'isMainPage:', isMainPage);

  return (
    <>
      {isMainPage && (
        <div className="min-h-screen bg-background p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">学员管理</h1>
              <Link to="/students/new">
                <Button onClick={() => {
                  console.log('[StudentTable] 跳转新增页面');
                }}><CirclePlusIcon/>添加学员</Button>
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

export default StudentTable;