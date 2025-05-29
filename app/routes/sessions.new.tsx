import { useState } from "react";
import EditPage, { Column } from "~/components/common/EditPage";
import { BadmintonSession, Student } from "~/types/session";
import { useNavigate } from "@remix-run/react";
import ShortUniqueId from 'short-uuid';
import { mockStudents } from "~/mock/sessions";
import MultiSelect from "~/components/common/MultiSelect";

// 简单下拉组件
function SimpleSelect({ options, value, onChange, label, placeholder }: { options: { label: string, value: string }[], value: string, onChange: (v: string) => void, label?: string, placeholder?: string }) {
    return (
        <select
            className="border rounded px-2 py-1 w-full"
            value={value}
            onChange={e => {
                console.log(`[NewSession] ${label || ''}选择变更`, e.target.value);
                onChange(e.target.value);
            }}
        >
            <option value="" disabled>{placeholder || '请选择'}</option>
            {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
    );
}

export default function NewSession() {
    const [record, setRecord] = useState<BadmintonSession>({
        id: '', // 初始为空，避免SSR/CSR不一致
        title: '',
        coach: '',
        dateTime: '',
        sessionType: '一对一',
        equipment: [],
        clientType: '青少年',
        courtName: '',
        courtNumber: '',
        students: [],
        totalStudents: 0,
        feePerStudent: 0,
    });
    const navigate = useNavigate();

    function handleChange(field: keyof BadmintonSession, value: unknown) {
        console.log('[NewSession] 字段变更', field, value);
        // 自动更新总学员数
        if (field === 'students' && Array.isArray(value)) {
            setRecord(r => ({ ...r, students: value, totalStudents: value.length }));
        } else {
            setRecord(r => ({ ...r, [field]: value }));
        }
    }

    function handleSave(data: BadmintonSession) {
        const suid = ShortUniqueId();
        const saveData = { ...data, id: suid.new() };
        console.log('[NewSession] 保存', saveData);
        // TODO: 保存逻辑
        navigate('/sessions');
    }

    // 获取所有学员选项
    const allStudents: Student[] = mockStudents;
    const studentOptions = allStudents.map(s => ({ label: s.name, value: s.id }));

    // 课程类型、设备、学员类型选项
    const sessionTypeOptions = [
        { label: '一对一', value: '一对一' },
        { label: '一对二', value: '一对二' },
        { label: '一对多', value: '一对多' },
        { label: '夏令营', value: '夏令营' },
        { label: '开放式团课', value: '开放式团课' },
    ];
    const equipmentOptions = [
        { label: '球拍', value: '球拍' },
        { label: '羽毛球', value: '羽毛球' },
        { label: '球网', value: '球网' },
    ];
    const clientTypeOptions = [
        { label: '青少年', value: '青少年' },
        { label: '成人', value: '成人' },
        { label: '儿童', value: '儿童' },
    ];

    // 定义所有字段
    const newSessionColumns: Column<BadmintonSession>[] = [
        // {
        //     title: "课程ID",
        //     dataIndex: "id",
        //     render: value => <span className="text-gray-400">{String(value)}</span>,
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
            render: (value, _record, onFieldChange) => (
                <SimpleSelect
                    options={sessionTypeOptions}
                    value={value as string}
                    onChange={v => onFieldChange(v)}
                    label="课程类型"
                    placeholder="请选择课程类型"
                />
            )
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
                        console.log('[NewSession] 学员选择变更', ids);
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
                        console.log('[NewSession] 设备选择变更', v);
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
                <SimpleSelect
                    options={clientTypeOptions}
                    value={value as string}
                    onChange={v => onFieldChange(v)}
                    label="学员类型"
                    placeholder="请选择学员类型"
                />
            )
        },
        {
            title: "总学员数",
            dataIndex: "totalStudents",
            render: value => <span className="text-gray-400">{String(value)}</span>,
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
                        console.log('[NewSession] 单人学费变更', v);
                        onFieldChange(isNaN(v) ? 0 : v);
                    }}
                />
            )
        },
    ];

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">新增课程</h1>
            <EditPage
                record={record}
                columns={newSessionColumns}
                onChange={handleChange}
                onSave={handleSave}
                onCancel={() => navigate('/sessions')}
            />
        </div>
    );
}