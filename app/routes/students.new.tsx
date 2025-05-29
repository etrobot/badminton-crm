import { useState } from "react";
import EditPage, { Column } from "~/components/common/EditPage";
import { Student } from "~/types/session"; // 假设学员类型定义在 session.ts 或 types/session.ts 中
import { useNavigate } from "@remix-run/react";

export default function NewStudent() {
  // 初始化一个空学员对象用于新增
  const [record, setRecord] = useState<Student>({} as Student); // 需要根据 Student 类型定义提供默认值或空对象
  const navigate = useNavigate();

  function handleChange(field: keyof Student, value: unknown) {
    console.log('[NewStudent] 字段变更', field, value);
    setRecord(r => ({ ...r, [field]: value as Student[typeof field] }));
  }

  function handleSave(data: Student) {
    console.log('[NewStudent] 保存新学员', data);
    // TODO: 保存逻辑
    // 在实际应用中，这里会调用 API 创建新学员
    console.log('[NewStudent] 模拟保存成功，跳转回列表页');
    navigate('/students'); // 保存后跳转回列表页
  }

  // 定义新增页面的字段配置，与编辑页面类似，但可能略有不同 (例如，ID 不会出现在新增表单)
  const newStudentColumns: Column<Student>[] = [
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
            console.log('[NewStudent] 性别选择变更', e.target.value);
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
            console.log('[NewStudent] 等级变更', v);
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
            console.log('[NewStudent] 预存款变更', v);
            onFieldChange(isNaN(v) ? 0 : v);
          }}
        />
      )
    },
    {
      title: "备注",
      dataIndex: "remark",
    },
    // 添加其他需要新增的学员字段
  ];

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">新增学员</h1>
      <EditPage
        record={record}
        columns={newStudentColumns}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => navigate('/students')} // 添加取消按钮的逻辑
      />
    </div>
  );
}