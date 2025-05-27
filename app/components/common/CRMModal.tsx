import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";

// 字段类型定义
type FieldType = 'text' | 'select' | 'number' | 'datetime-local';

export interface CRMModalField {
  label: string;
  name: string;
  type: FieldType;
  required?: boolean;
  options?: { label: string; value: string | number }[]; // select用
}

interface CRMModalProps<T extends Record<string, string | number | undefined>> {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: T) => void;
  fields: CRMModalField[];
  initialData: T;
  title?: string;
}

export default function CRMModal<T extends Record<string, string | number | undefined>>({
  isOpen,
  onClose,
  onSubmit,
  fields,
  initialData,
  title,
}: CRMModalProps<T>) {
  const [formData, setFormData] = useState<T>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  // 弹窗打开时禁止body滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let newValue: string | number = value;
    const field = fields.find(f => f.name === name);
    if (field) {
      if (field.type === 'number') {
        newValue = value === '' ? '' : Number(value);
      }
    }
    setFormData(prev => {
      const next = { ...prev, [name]: newValue };
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  // 桌面端：shadcn Dialog
  const desktopModal = (
    <Dialog open={isOpen} onOpenChange={open => {console.log('CRMModal Dialog onOpenChange', open); if (!open) onClose();}}>
      <DialogContent className="w-96">
        <DialogTitle>{title || '表单'}</DialogTitle>
        <form onSubmit={e => {console.log('CRMModal handleSubmit 入参', e); handleSubmit(e);}}>
          {fields.map(field => (
            <div className="mb-4" key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
              </label>
              {field.type === 'select' ? (
                <Select
                  value={formData[field.name] !== undefined ? String(formData[field.name]) : ''}
                  onValueChange={val => {
                    console.log('CRMModal Select onValueChange', field.name, val);
                    handleChange({ target: { name: field.name, value: val } } as React.ChangeEvent<HTMLInputElement>);
                  }}
                >
                  <SelectTrigger id={field.name} name={field.name} className="mt-1 block w-full">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map(opt => (
                      <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type={field.type}
                  name={field.name}
                  id={field.name}
                  value={formData[field.name] ?? ''}
                  onChange={e => {console.log('CRMModal Input onChange', field.name, e.target.value); handleChange(e);}}
                  required={field.required}
                  className="mt-1 block w-full"
                />
              )}
            </div>
          ))}
          <div className="items-center px-4 py-3">
            <Button type="submit" className="w-full" variant="default">
              保存
            </Button>
            <Button
              type="button"
              className="mt-3 w-full"
              variant="secondary"
              onClick={() => {console.log('CRMModal onClose'); onClose();}}
            >
              取消
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  // 移动端 Drawer 保持不变
  const mobileModal = (
    <div
      className="fixed bottom-0 left-0 right-0 rounded-t-2xl bg-white p-5 border-t shadow-lg animate-slide-up block md:hidden max-h-[80vh] overflow-y-auto"
      style={{
        transition: 'transform 0.3s',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
        {title || '表单'}
      </h3>
      <form onSubmit={e => {console.log('CRMModal handleSubmit 入参', e); handleSubmit(e);}}>
        {fields.map(field => (
          <div className="mb-4" key={field.name}>
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
            </label>
            {field.type === 'select' ? (
              <Select
                value={formData[field.name] !== undefined ? String(formData[field.name]) : ''}
                onValueChange={val => {
                  console.log('CRMModal Select onValueChange', field.name, val);
                  handleChange({ target: { name: field.name, value: val } } as React.ChangeEvent<HTMLInputElement>);
                }}
              >
                <SelectTrigger id={field.name} name={field.name} className="mt-1 block w-full">
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map(opt => (
                    <SelectItem key={opt.value} value={String(opt.value)}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                type={field.type}
                name={field.name}
                id={field.name}
                value={formData[field.name] ?? ''}
                onChange={e => {console.log('CRMModal Input onChange', field.name, e.target.value); handleChange(e);}}
                required={field.required}
                className="mt-1 block w-full"
              />
            )}
          </div>
        ))}
        <div className="items-center px-4 py-3">
          <Button type="submit" className="w-full" variant="default">
            保存
          </Button>
          <Button
            type="button"
            className="mt-3 w-full"
            variant="secondary"
            onClick={() => {console.log('CRMModal onClose'); onClose();}}
          >
            取消
          </Button>
        </div>
      </form>
    </div>
  );

  // 用Portal渲染到body，彻底避免被父级margin/space-y影响
  return typeof window !== 'undefined' && document.body
    ? ReactDOM.createPortal(
        <>
          <div className="hidden md:block">{desktopModal}</div>
          {mobileModal}
          {/* 移动端动画样式 */}
          <style>{`
            @keyframes slide-up {
              from { transform: translateY(100%); }
              to { transform: translateY(0); }
            }
            .animate-slide-up {
              animation: slide-up 0.3s cubic-bezier(0.4,0,0.2,1);
            }
          `}</style>
        </>,
        document.body
      )
    : null;
}