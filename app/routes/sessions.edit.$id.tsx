import { useState } from "react";
import EditPage, { Column } from "~/components/common/EditPage";
import { BadmintonSession, Student } from "~/types/session";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { mockSessions, mockStudents } from "~/mock/sessions"; // 导入模拟数据
import MultiSelect from "~/components/common/MultiSelect";

export async function loader({ params }: { params: { id: string } }) {
  // TODO: 替换为真实数据获取逻辑
  // 这里不再使用硬编码的 mock 数据，而是根据 id 从 mockSessions 中查找
  const session = mockSessions.find(session => session.id === params.id);

  if (!session) {
    // 如果找不到对应的 session，返回 null 或者抛出错误
    console.log(`[EditSession Loader] 未找到 ID 为 ${params.id} 的课程`);
    return null;
  }

  console.log(`[EditSession Loader] 找到课程`, session);
  return session;
}

export default function EditSession() {
  const session = useLoaderData() as BadmintonSession | null; // loader 可能返回 null
  const [record, setRecord] = useState<BadmintonSession | null>(session);
  const navigate = useNavigate();

  // 如果 session 不存在，可以显示一个错误消息或者重定向
  if (!record) {
    return <div className="p-4 max-w-xl mx-auto">课程不存在</div>;
  }

  function handleChange(field: keyof BadmintonSession, value: unknown) {
    console.log('[EditSession] 字段变更', field, value);
    // 确保 record 不为 null 时再更新状态
    if (record) {
      setRecord(r => (r ? { ...r, [field]: value as BadmintonSession[typeof field] } : null));
    }
  }

  function handleSave(data: BadmintonSession) {
    console.log('[EditSession] 保存', data);
    // TODO: 保存逻辑
    navigate('/sessions'); // 保存后跳转回列表页
  }

  // 获取所有学员选项
  const allStudents: Student[] = mockStudents;
  const studentOptions = allStudents.map(s => ({ label: s.name, value: s.id }));

  // 获取所有设备选项（去重）
  const allEquipment: string[] = Array.from(
    new Map(
      mockSessions.flatMap(s => s.equipment).map(e => [e, e])
    ).values()
  );
  const equipmentOptions = allEquipment.map(e => ({ label: e, value: e }));

  // 定义编辑页面的字段配置
  const editSessionColumns: Column<BadmintonSession>[] = [
    // {
    //   title: "课程ID",
    //   dataIndex: "id",
    //   render: value => <span className="text-gray-400">{String(value)}</span>,
    // },
    {
      title: "课程名称",
      dataIndex: "title",
    },
    { title: "教练", dataIndex: "coach" },
    {
      title: "时间",
      dataIndex: "dateTime",
    },
    {
      title: "课程类型",
      dataIndex: "sessionType",
      // TODO: 添加课程类型选择器 render
    },
    { title: "场地", dataIndex: "courtName" },
    { title: "场地号", dataIndex: "courtNumber" },
    {
      title: "学员",
      dataIndex: "students",
      render: (value, _record, onFieldChange) => (
        <MultiSelect
          options={studentOptions}
          value={Array.isArray(value) ? value : []}
          onChange={(ids: string[]) => {
            console.log('[EditSession] 学员选择变更', ids);
            onFieldChange(ids);
          }}
          placeholder="请选择学员"
          label="学员"
        />
      )
    },
    {
      title: "设备",
      dataIndex: "equipment",
      render: (value, _record, onFieldChange) => (
        <MultiSelect
          options={equipmentOptions}
          value={Array.isArray(value) ? (value as string[]) : []}
          onChange={v => {
            console.log('[EditSession] 设备选择变更', v);
            onFieldChange(v);
          }}
          placeholder="请选择设备"
          label="设备"
        />
      )
    },
    {
      title: "学员类型",
      dataIndex: "clientType",
      render: (value, _record, onFieldChange) => (
        <select
          className="border rounded px-2 py-1 w-full"
          value={value as string}
          onChange={e => {
            console.log('[EditSession] 学员类型选择变更', e.target.value);
            onFieldChange(e.target.value);
          }}
        >
          <option value="" disabled>请选择学员类型</option>
          <option value="青少年">青少年</option>
          <option value="成人">成人</option>
        </select>
      )
    },
    {
      title: "单人学费",
      dataIndex: "feePerStudent",
      render: (value, _record, onFieldChange) => (
        <input
          type="number"
          className="border rounded px-2 py-1 w-full"
          value={value as number ?? undefined}
          min={0}
          step={1}
          placeholder="请输入单人学费"
          onChange={e => {
            const v = Number(e.target.value);
            console.log('[EditSession] 单人学费变更', v);
            onFieldChange(isNaN(v) ? 0 : v);
          }}
        />
      )
    },
    // 总学员数 totalStudents 是根据 students 计算得出的，不作为编辑项
    // {
    //   title: "总学员数",
    //   dataIndex: "totalStudents",
    // },
  ];

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">编辑课程 (ID: {record.id})</h1> {/* 显示课程ID */}
      <EditPage
        record={record}
        columns={editSessionColumns}
        onChange={handleChange}
        onSave={handleSave}
        onCancel={() => navigate('/sessions')} // 添加取消按钮的逻辑
      />
    </div>
  );
}