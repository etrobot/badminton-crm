import { useState } from "react";
import type { BadmintonSession } from "../../types/session";

// 通用 Column 定义，将其导出以便 RecordCard 使用
export interface Column<T = BadmintonSession> {
  title: string;
  dataIndex: keyof T | string;
  render?: (value: unknown, record: T) => React.ReactNode;
}

interface CRMTableProps<T = BadmintonSession> {
  sessions: T[];
  columns: Column<T>[];
}

export default function CRMTable<T = BadmintonSession>({ sessions, columns }: CRMTableProps<T>) {
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
    console.log('[CRMTable] handleHeaderClick 入参:', clickedField);
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
      <div className="hidden w-full border-b md:flex">
        {columns.map((col, index) => (
          <div
            key={String(col.dataIndex)}
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
      {sortedSessions.map((session, idx) => {
        console.log('[CRMTable] 渲染数据行 idx:', idx, 'session:', session);
        return (
          <div key={idx} className="w-full border rounded-lg md:rounded-none mb-1 md:mb-0 shadow-sm md:shadow-none flex flex-col md:flex-row">
            {/* 移动端：两列布局，只显示值 */}
            <div className="flex flex-wrap md:hidden">
              {columns.map((col, colIdx) => (
                <div
                  key={String(col.dataIndex)}
                  className={`box-border px-4 py-2 text-sm flex-1 basis-1/2 ${colIdx % 2 === 0 ? 'text-left' : 'text-right'}`}
                  style={{ minWidth: 0 }}
                >
                  {(() => {
                    const value = col.render ? col.render(session[col.dataIndex as keyof T], session) : String(session[col.dataIndex as keyof T]);
                    console.log(`[CRMTable] 移动端渲染 idx:${idx} colIdx:${colIdx} col:${String(col.dataIndex)} value:`, value);
                    return value;
                  })()}
                </div>
              ))}
            </div>
            {/* 桌面端：原有布局 */}
            <div className="hidden md:flex w-full">
              {columns.map((col, index) => (
                <div key={String(col.dataIndex)} className={`px-4 py-2 text-sm flex justify-between items-center md:flex-1 ${index === 0 ? 'font-bold' : ''}`}>
                  <div className="text-right md:text-left flex-1">
                    {col.render ? col.render(session[col.dataIndex as keyof T], session) : String(session[col.dataIndex as keyof T])}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
