import React from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

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

  const getDateValue = (value: Date | string | null | undefined): Date | undefined => {
    if (value instanceof Date) {
      return value;
    } else if (typeof value === 'string' && value) {
      try {
        const date = new Date(value);
        return isNaN(date.getTime()) ? undefined : date;
      } catch (e) {
        console.log('[EditPage] 日期字段解析失败', value, e);
        return undefined;
      }
    }
    return undefined;
  };

  const handleDateChange = (colDataIndex: keyof T, date: Date | undefined) => {
    console.log('[EditPage] 日期时间选择器变更', colDataIndex, date);
    // 传递 Date 对象或 null
    onChange(colDataIndex, (date === undefined ? null : date) as T[keyof T]);
  };

  const handleTimeChange = (colDataIndex: keyof T, type: "hour" | "minute", value: string) => {
    const currentDate = getDateValue(record[colDataIndex] as Date | string | null | undefined) || new Date();
    const newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else {
      console.log(`[EditPage] handleTimeChange: unknown type ${type}`);
    }

    handleDateChange(colDataIndex, newDate);
  };

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
            (typeof record[col.dataIndex] === 'string' || record[col.dataIndex] instanceof Date || record[col.dataIndex] === null || record[col.dataIndex] === undefined) &&
            (col.dataIndex.toString().toLowerCase().includes('date') || col.dataIndex.toString().toLowerCase().includes('time')) ? (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !record[col.dataIndex] && "text-muted-foreground"
                    )}
                  >
                    {getDateValue(record[col.dataIndex] as Date | string | null | undefined) ? (
                      format(getDateValue(record[col.dataIndex] as Date | string | null | undefined)!, "MM/dd/yyyy HH:mm")
                    ) : (
                      <span>MM/DD/YYYY HH:mm</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <div className="sm:flex">
                    <Calendar
                      mode="single"
                      selected={getDateValue(record[col.dataIndex] as Date | string | null | undefined)}
                      onSelect={(date) => handleDateChange(col.dataIndex, date)}
                      initialFocus
                    />
                    <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 24 }, (_, i) => i)
                            .reverse()
                            .map((hour) => (
                              <Button
                                key={hour}
                                size="icon"
                                variant={
                                  (getDateValue(record[col.dataIndex] as Date | string | null | undefined) || new Date()).getHours() === hour
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleTimeChange(col.dataIndex, "hour", hour.toString())
                                }
                              >
                                {hour}
                              </Button>
                            ))}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>
                      <ScrollArea className="w-64 sm:w-auto">
                        <div className="flex sm:flex-col p-2">
                          {Array.from({ length: 12 }, (_, i) => i * 5).map(
                            (minute) => (
                              <Button
                                key={minute}
                                size="icon"
                                variant={
                                  (getDateValue(record[col.dataIndex] as Date | string | null | undefined) || new Date()).getMinutes() === minute
                                    ? "default"
                                    : "ghost"
                                }
                                className="sm:w-full shrink-0 aspect-square"
                                onClick={() =>
                                  handleTimeChange(col.dataIndex, "minute", minute.toString())
                                }
                              >
                                {minute.toString().padStart(2, "0")}
                              </Button>
                            )
                          )}
                        </div>
                        <ScrollBar
                          orientation="horizontal"
                          className="sm:hidden"
                        />
                      </ScrollArea>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
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