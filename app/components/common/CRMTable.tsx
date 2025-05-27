import { BadmintonSession } from "~/types/session";
import { RecordCard } from "./record-card";

interface CRMTableProps {
  sessions: BadmintonSession[];
  onEdit: (session: BadmintonSession) => void;
  columns: Column<BadmintonSession & { actions?: React.ReactNode }>[];
}

// 通用 Column 定义
interface Column<T> {
  title: string;
  dataIndex: keyof T;
  render?: (value: T[keyof T], record: T) => React.ReactNode;
}

export default function CRMTable({ sessions, onEdit, columns }: CRMTableProps) {
  return (
    <>
      {/* PC端列表 */}
      <div className="hidden md:block">
        {/* 表头 */}
        <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted rounded-t-lg text-sm font-medium">
          {columns.map((col, idx) => (
            <div
              key={col.dataIndex as string}
              className={
                idx === 0
                  ? "col-span-3"
                  : idx === 1
                  ? "col-span-2"
                  : idx === 2
                  ? "col-span-2"
                  : idx === 3
                  ? "col-span-3"
                  : "col-span-2"
              }
            >
              {col.title}
            </div>
          ))}
        </div>
        {/* 数据行 */}
        <div className="space-y-1">
          {sessions.map((row, rowIdx) => {
            const typedRow = row as BadmintonSession & { actions?: React.ReactNode };
            return (
              <div
                key={typedRow.id || rowIdx}
                className="grid grid-cols-12 gap-4 px-6 py-3 bg-background rounded-lg text-sm items-center"
              >
                {columns.map((col, colIdx) => {
                  const value = typedRow[col.dataIndex];
                  const cell = col.render ? col.render(value, typedRow) : (value as React.ReactNode);
                  return (
                    <div
                      key={col.dataIndex as string}
                      className={
                        colIdx === 0
                          ? "col-span-3"
                          : colIdx === 1
                          ? "col-span-2"
                          : colIdx === 2
                          ? "col-span-2"
                          : colIdx === 3
                          ? "col-span-3"
                          : "col-span-2"
                      }
                    >
                      {cell}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
      {/* 移动端列表 */}
      <div className="md:hidden ">
        {sessions.map(session => (
          <RecordCard
            key={session.id}
            record={session as BadmintonSession & { actions?: React.ReactNode }}
            columns={columns}
            isMobile
            onEdit={() => onEdit(session)}
          />
        ))}
      </div>
    </>
  );
}
