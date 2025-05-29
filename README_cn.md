# 羽毛球课程管理系统 Demo

这是一个基于现代 Web 技术栈开发的羽毛球课程管理系统演示项目。

## 技术栈

- **前端框架**: React 18 + TypeScript
- **全栈框架**: Remix
- **UI 组件**: Radix UI + 自定义组件
- **样式**: Tailwind CSS
- **表单处理**: React Hook Form + Zod 验证
- **状态管理**: React Context + Hooks
- **日期处理**: date-fns + react-day-picker
- **构建工具**: Vite

## 功能特点

- 课程管理：创建、查看、编辑和删除课程
- 学员管理：管理学员信息和报名情况
- 课程表：可视化展示课程安排
- 响应式设计：适配各种设备屏幕
- 现代化 UI：美观直观的用户界面

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
pnpm start
```

## 项目结构

```
.
├── app/                    # 应用主要代码
│   ├── components/         # 可复用组件
│   ├── routes/             # 页面路由
│   ├── styles/             # 全局样式
│   └── utils/              # 工具函数
├── public/                 # 静态资源
└── ...
```

## 许可证

[MIT](LICENSE)
