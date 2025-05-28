import { useState } from "react";

// 通用 Column 定义，将其导出以便 RecordCard 使用
export interface Column<T = any> {
  title: string;
  dataIndex: keyof T | string;
  render?: (value: any, record: T) => React.ReactNode;
}

interface CRMTableProps<T = any> {
  sessions: T[];
  columns: Column<T>[];
}

export default function CRMTable<T = any>({ sessions, columns }: CRMTableProps<T>) {
  // 排序状态
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // 排序处理
  const sortedSessions = [...sessions];
  if (sortField) {
    sortedSessions.sort((a, b) => {
      const aValue = a[sortField as keyof T];
      const bValue = b[sortField as keyof T];
      let result = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        result = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        result = aValue.localeCompare(bValue);
      } else {
        // 对于其他类型，可以根据需要添加比较逻辑，或者转换为字符串进行比较
        // 这里简单地转换为字符串进行比较
        const aStr = String(aValue);
        const bStr = String(bValue);
        result = aStr.localeCompare(bStr);
      }
      return sortOrder === 'asc' ? result : -result;
    });
    console.log('[CRMTable] 排序字段:', sortField, '顺序:', sortOrder, '结果:', sortedSessions.map(s => s[sortField as keyof T]));
  }

  // 处理表头点击
  const handleHeaderClick = (col: Column<T>) => {
    // 检查该列是否可排序（如果以后添加 sortable 属性可以在这里判断）
    // 目前假设所有列都可排序
    const clickedField = col.dataIndex as string;

    if (sortField === clickedField) {
      // 如果点击的是当前排序字段
      if (sortOrder === 'asc') {
        setSortOrder('desc');
        console.log(`[CRMTable] ${clickedField} 排序顺序: desc`);
      } else { // sortOrder === 'desc'
        setSortField(null); // 取消排序
        setSortOrder('asc'); // 恢复默认顺序，为下次点击准备
        console.log(`[CRMTable] 取消 ${clickedField} 排序`);
      }
    } else {
      // 如果点击的是新的字段
      setSortField(clickedField);
      setSortOrder('asc');
      console.log(`[CRMTable] 设置排序字段为 ${clickedField}, 顺序: asc`);
    }
  };

  // 支持键盘回车触发排序
  const handleHeaderKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, col: Column<T>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleHeaderClick(col);
    }
  };

  // 统一用div渲染（桌面端和移动端都用div）
  return (
    <div className="mt-2">
      {/* 表头 */}
      <div className="hidden w-full bg-gray-50 border-b md:flex">
        {columns.map((col, index) => (
          <div
            key={col.dataIndex as string}
            className={
              `px-4 py-3 text-sm flex-1 cursor-pointer select-none ${sortField === col.dataIndex ? 'text-blue-600' : ''} ${index === 0 ? 'font-bold' : ''}`
            }
            onClick={() => handleHeaderClick(col)}
            role="button"
            tabIndex={0}
            onKeyDown={e => handleHeaderKeyDown(e, col)}
          >
            {col.title}
            {/* 排序指示器 */}
            {sortField === col.dataIndex && (
              <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
            )}
          </div>
        ))}
      </div>
      {/* 数据行 */}
      {sortedSessions.map((session, idx) => (
        <div key={idx} className="w-full border-t bg-white hover:bg-gray-50 md:flex">
          {columns.map((col, index) => (
            <div key={col.dataIndex as string} className={`px-4 py-3 text-sm flex-1 ${index === 0 ? 'font-bold' : ''}`}>
              {col.render ? col.render(session[col.dataIndex as keyof T], session) : String(session[col.dataIndex as keyof T])}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
