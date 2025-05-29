import { useState } from "react";
import EditPage, { Column } from "~/components/common/EditPage";
import { Student } from "~/types/session"; // 假设学员类型定义在 session.ts 或 types/session.ts 中
import { useLoaderData, useNavigate } from "@remix-run/react";
import { mockStudents } from "~/mock/sessions"; // 导入模拟数据

export async function loader({ params }: { params: { id: string } }) {
  console.log(`[EditStudent Loader] 尝试加载学员 ID: ${params.id}`);
  // TODO: 替换为真实数据获取逻辑
  const student = mockStudents.find(student => student.id === params.id);

  if (!student) {
    console.log(`[EditStudent Loader] 未找到 ID 为 ${params.id} 的学员`);
    return null;
  }

  console.log(`[EditStudent Loader] 找到学员`, student);
  return student;
}

export default function EditStudent() {
  const student = useLoaderData() as Student | null; // loader 可能返回 null
  const [record, setRecord] = useState<Student | null>(student);
  const navigate = useNavigate();

  // 如果 student 不存在，可以显示一个错误消息或者重定向
  if (!record) {
    return <div className="p-4 max-w-xl mx-auto">学员不存在</div>;
  }

  function handleChange(field: keyof Student, value: unknown) {
    console.log('[EditStudent] 字段变更', field, value);
    // 确保 record 不为 null 时再更新状态
    if (record) {
      setRecord(r => (r ? { ...r, [field]: value as Student[typeof field] } : null));
    }
  }

  function handleSave(data: Student) {
    console.log('[EditStudent] 保存学员', data);
    // TODO: 保存逻辑
    // 在实际应用中，这里会调用 API 更新学员信息
    console.log('[EditStudent] 模拟保存成功，跳转回列表页');
    navigate('/students'); // 保存后跳转回列表页
  }

  // 定义编辑页面的字段配置
  const editStudentColumns: Column<Student>[] = [
    // { // ID 通常不编辑，仅显示
    //   title: "学员ID",
    //   dataIndex: "id",
    //   render: value => <span className="text-gray-400">{String(value)}</span>,
    // },
    {
      title: "姓名",
      dataIndex: "name",
    },
    {
      title: "性别",
      dataIndex: "gender",
      render: (value, _record, onFieldChange) => (
        <select
          className="border rounded px-2 py-1 w-full"
          value={value as string}
          onChange={e => {
            console.log('[EditStudent] 性别选择变更', e.target.value);
            onFieldChange(e.target.value);
          }}
        >
          <option value="" disabled>请选择性别</option>
          <option value="male">男</option>
          <option value="female">女</option>
        </select>
      )
    },
    {
      title: "生日",
      dataIndex: "birthday",
      // TODO: 考虑使用日期选择器
    },
    {
      title: "等级",
      dataIndex: "level",
      render: (value, _record, onFieldChange) => (
         <input
          type="number"
          className="border rounded px-2 py-1 w-full"
          value={value as number ?? undefined}
          min={0}
          step={1}
          placeholder="请输入学员等级"
          onChange={e => {
            const v = Number(e.target.value);
            console.log('[EditStudent] 等级变更', v);
            onFieldChange(isNaN(v) ? 0 : v);
          }}
        />
      )
    },
     {
      title: "预存款",
      dataIndex: "prePay",
      render: (value, _record, onFieldChange) => (
        <input
          type="number"
          className="border rounded px-2 py-1 w-full"
          value={value as number ?? undefined}
          min={0}
          step={1}
          placeholder="请输入预存款"
          onChange={e => {
            const v = Number(e.target.value);
            console.log('[EditStudent] 预存款变更', v);
            onFieldChange(isNaN(v) ? 0 : v);
          }}
        />
      )
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    // 添加其他需要编辑的学员字段
  ];

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">编辑学员 (ID: {record.id})</h1> {/* 显示学员ID */}
      <EditPage
        record={record}
        columns={editStudentColumns}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => navigate('/students')} // 添加取消按钮的逻辑
      />
    </div>
  );
} 