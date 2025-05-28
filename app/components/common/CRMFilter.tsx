import React, { useState, useEffect } from 'react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  DrawerTitle,
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerDescription,
} from "../ui/drawer";
import MultiSelect from './MultiSelect';
import { FilterIcon } from 'lucide-react';
// TODO: 日期、时间选择器可后续用 shadcn 组件替换

// 定义不同过滤类型的配置接口
interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  name: string; // 字段名称
  label: string; // 显示标签
  type: 'date' | 'time' | 'select' | 'text'; // 过滤类型
  options?: FilterOption[]; // 选项，仅用于 select 类型
  // TODO: 可以添加更多属性，如默认值、placeholder 等
}

// 定义组件的 props 接口
interface CRMFilterProps {
  configs: FilterConfig[]; // 过滤配置数组
  onQuery: (filters: Record<string, string | string[]>) => void; // 查询回调函数
  onReset: () => void; // 重置回调函数
}

const CRMFilter: React.FC<CRMFilterProps> = ({ configs, onQuery, onReset }) => {
  // 状态用于存储当前的过滤值
  const [filters, setFilters] = useState<Record<string, string | string[]>>({}); // 明确类型
  // 新增：移动端Drawer开关
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 响应式判断
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      setIsMobile(mobile);
      console.log('[CRMFilter] isMobile', mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Drawer开关时禁止body滚动
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  // 处理输入变化的函数
  const handleInputChange = (name: string, value: string | string[]) => {
    console.log('[CRMFilter] handleInputChange 入参', { name, value });
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [name]: value };
      console.log('[CRMFilter] handleInputChange 出参', newFilters);
      return newFilters;
    });
  };

  // 新增：处理回车事件，按下回车时执行查询
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      console.log('[CRMFilter] handleKeyDown 回车触发查询', filters);
      handleQueryClick();
    }
  };

  // 渲染单个过滤项
  const renderFilterItem = (config: FilterConfig) => {
    console.log('[CRMFilter] renderFilterItem', config);
    switch (config.type) {
      case 'text':
        return (
          <div key={config.name} className="flex flex-col gap-1">
            <label className="text-xs">{config.label}:</label>
            <Input
              value={filters[config.name] as string || ''}
              onChange={(e) => handleInputChange(config.name, e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`请输入${config.label}`}
            />
          </div>
        );
      case 'select':
        // 使用MultiSelect组件
        return (
          <MultiSelect
            key={config.name}
            label={config.label}
            options={config.options || []}
            value={Array.isArray(filters[config.name]) ? (filters[config.name] as string[]) : []}
            onChange={(newValue) => {
              console.log('[CRMFilter] MultiSelect onChange', { name: config.name, newValue });
              handleInputChange(config.name, newValue);
            }}
            placeholder={`请选择${config.label}`}
          />
        );
      case 'date':
        return (
          <div key={config.name} className="flex flex-col gap-1">
            <label className="text-xs">{config.label}:</label>
            <Input
              type="date"
              value={filters[config.name] as string || ''}
              onChange={(e) => handleInputChange(config.name, e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        );
      case 'time':
        return (
          <div key={config.name} className="flex flex-col gap-1">
            <label className="text-xs">{config.label}:</label>
            <Input
              type="time"
              value={filters[config.name] as string || ''}
              onChange={(e) => handleInputChange(config.name, e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // 处理查询按钮点击
  const handleQueryClick = () => {
    console.log('[CRMFilter] handleQueryClick 查询参数', filters);
    onQuery(filters);
  };

  // 处理重置按钮点击
  const handleResetClick = () => {
    console.log('[CRMFilter] handleResetClick 重置');
    setFilters({}); // 清空过滤条件
    onReset(); // 调用外部重置回调
  };

  // 渲染表单内容（便于桌面/移动端复用）
  const renderForm = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mx-4 m-4">
        {configs.map(renderFilterItem)}
      </div>
      <div className="flex justify-end space-x-2 pb-4 mx-4">
        <Button size='sm'variant="outline" onClick={handleResetClick}>重置</Button>
        <Button size='sm'onClick={handleQueryClick}>查询</Button>
      </div>
    </>
  );

  // 移动端Drawer
  if (isMobile) {
    return (
      <Drawer open={isDrawerOpen} onOpenChange={(open) => {
        console.log('[CRMFilter] shadcn Drawer onOpenChange', open);
        setIsDrawerOpen(open);
      }}>
        <div>
          <DrawerTrigger asChild>
            <Button variant='outline' onClick={() => {console.log('[CRMFilter] 筛选Drawer打开');}}>
              <FilterIcon className="mr-2 h-4 w-4" />
              筛选
            </Button>
          </DrawerTrigger>
        </div>
        <DrawerContent className="overflow-y-auto max-h-[80vh]">
          <DrawerTitle/><DrawerDescription/>
          {renderForm()}
        </DrawerContent>
      </Drawer>
    );
  }

  // 桌面端原有表单
  return (
    <div className="crm-filter space-y-4 border rounded">
      {renderForm()}
    </div>
  );
};

export default CRMFilter;