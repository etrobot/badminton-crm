import type { MetaFunction } from "@remix-run/node";
import { mockSessions } from "~/mock/sessions";
import { SessionCard } from "~/components/session-card";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "羽毛球课程管理系统" },
    { name: "description", content: "羽毛球课程管理系统" },
  ];
};

export default function Index() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">课程管理</h1>
          <Button>添加课程</Button>
        </div>

        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-muted rounded-t-lg text-sm font-medium">
            <div className="col-span-3">课程信息</div>
            <div className="col-span-2">教练</div>
            <div className="col-span-2">场地</div>
            <div className="col-span-3">学员</div>
            <div className="col-span-2">操作</div>
          </div>
          <div className="space-y-1">
            {mockSessions.map(session => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        </div>

        <div className="md:hidden space-y-4">
          {mockSessions.map(session => (
            <SessionCard key={session.id} session={session} isMobile />
          ))}
        </div>
      </div>
    </div>
  );
}