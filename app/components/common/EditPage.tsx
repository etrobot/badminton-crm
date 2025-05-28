import React from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export interface Column<T> {
  title: string;
  dataIndex: keyof T;
  render?: (
    value: T[keyof T],
    record: T,
    onChange: (val: T[keyof T]) => void
  ) => React.ReactNode;
}

interface EditPageProps<T> {
  record: T;
  columns: Column<T>[];
  onChange: (field: keyof T, value: T[keyof T]) => void;
  onSave: (record: T) => void;
  onCancel?: () => void;
}

function EditPage<T>({ record, columns, onChange, onSave, onCancel }: EditPageProps<T>) {
  console.log('[EditPage] 渲染', record);

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        console.log('[EditPage] 提交', record);
        onSave(record);
      }}
    >
      {columns.map(col => (
        <div key={col.dataIndex as string} style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4 }}>{col.title}</label>
          {col.render ? (
            col.render(record[col.dataIndex], record, val => {
              console.log('[EditPage] 字段变更', col.dataIndex, val);
              onChange(col.dataIndex, val);
            })
          ) : (
            // 自动识别日期时间字段
            (typeof record[col.dataIndex] === 'string' || record[col.dataIndex] instanceof Date) &&
            (col.dataIndex.toString().toLowerCase().includes('date') || col.dataIndex.toString().toLowerCase().includes('time')) ? (
              <input
                type="datetime-local"
                value={record[col.dataIndex]
                  ? (() => {
                      try {
                        const d = new Date(record[col.dataIndex] as string);
                        // 转为input可识别格式
                        return d.toISOString().slice(0, 16);
                      } catch (e) {
                        console.log('[EditPage] 日期字段解析失败', col.dataIndex, record[col.dataIndex], e);
                        return '';
                      }
                    })()
                  : ''}
                onChange={e => {
                  const val = e.target.value;
                  const date = val ? new Date(val) : undefined;
                  console.log('[EditPage] datetime-local change', col.dataIndex, val, date);
                  onChange(col.dataIndex, (date ? date.toISOString() : '') as T[keyof T]);
                }}
                className="border rounded px-2 py-1 w-full"
              />
            ) : (
              <Input
                value={typeof record[col.dataIndex] === 'string' ? (record[col.dataIndex] as string) : ''}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  console.log('[EditPage] 默认input change', col.dataIndex, e.target.value);
                  onChange(col.dataIndex, e.target.value as T[keyof T]);
                }}
              />
            )
          )}
        </div>
      ))}
      <Button type="submit">保存</Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          if (onCancel) {
            console.log('[EditPage] 调用传入的 onCancel');
            onCancel();
          } else {
            console.log('[EditPage] 未传入 onCancel，返回上一页');
            window.history.back();
          }
        }}
        style={{ marginLeft: 8 }}
      >
        取消
      </Button>
    </form>
  );
}

export default EditPage;