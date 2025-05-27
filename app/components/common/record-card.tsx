import React from 'react';
import { Button } from "~/components/ui/button";

interface Column<T> {
  title: string;
  dataIndex: keyof T;
  render?: (value: T[keyof T], record: T) => React.ReactNode;
}

interface RecordCardProps<T> {
  record: T;
  columns: Column<T>[];
  isMobile?: boolean;
  onEdit?: () => void;
}

export function RecordCard<T>({ record, columns, isMobile = false, onEdit }: RecordCardProps<T>) {
  if (isMobile) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-4 ">
        {/* 通用字段渲染 */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          {columns.map(col => (
            <div key={col.dataIndex as string}>
              <p className="text-muted-foreground">{col.title}</p>
              <p>
                {col.render ? col.render(record[col.dataIndex], record) : String(record[col.dataIndex])}
              </p>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>编辑</Button>
          <Button variant="destructive" size="sm">删除</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-card hover:bg-muted/50 transition-colors">
      {columns.map(col => (
        <div key={col.dataIndex as string} className="col-span-3">
          <span className="font-medium">{col.title}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">
              {col.render ? col.render(record[col.dataIndex], record) : String(record[col.dataIndex])}
            </span>
          </div>
        </div>
      ))}
      <div className="col-span-2 flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>编辑</Button>
        <Button variant="destructive" size="sm">删除</Button>
      </div>
    </div>
  );
}