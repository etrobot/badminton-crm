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
      }
      return sortOrder === 'asc' ? result : -result;
    });
    console.log('[CRMTable] 排序字段:', sortField, '顺序:', sortOrder, '结果:', sortedSessions.map(s => s[sortField as keyof T]));
  }

  // 处理表头点击
  const handleHeaderClick = (col: Column<T>) => {
    if (col.dataIndex === 'feePerClient') {
      if (sortField === 'feePerClient') {
        if (sortOrder === 'asc') {
          setSortOrder('desc');
          console.log('[CRMTable] feePerClient排序顺序: desc');
        } else if (sortOrder === 'desc') {
          setSortField(null);
          setSortOrder('asc'); // 恢复默认
          console.log('[CRMTable] 取消feePerClient排序');
        }
      } else {
        setSortField('feePerClient');
        setSortOrder('asc');
        console.log('[CRMTable] 设置排序字段为feePerClient, 顺序: asc');
      }
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
      <div className="flex w-full bg-gray-50 border-b">
        {columns.map((col) => (
          <div
            key={col.dataIndex as string}
            className={`px-4 py-3 text-sm font-medium flex-1 cursor-pointer select-none ${col.dataIndex === 'feePerClient' ? 'text-blue-600' : ''}`}
            onClick={() => handleHeaderClick(col)}
            role="button"
            tabIndex={0}
            onKeyDown={e => handleHeaderKeyDown(e, col)}
          >
            {col.title}
            {/* 排序指示器 */}
            {col.dataIndex === 'feePerClient' && sortField === 'feePerClient' && (
              <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
            )}
          </div>
        ))}
      </div>
      {/* 数据行 */}
      {sortedSessions.map((session, idx) => (
        <div key={idx} className="flex w-full border-b bg-white hover:bg-gray-50">
          {columns.map((col) => (
            <div key={col.dataIndex as string} className="px-4 py-3 text-sm flex-1">
              {col.render ? col.render(session[col.dataIndex as keyof T], session) : String(session[col.dataIndex as keyof T])}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
