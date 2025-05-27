import { useState } from "react";
import { type LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/react";
import { mockSessions } from "~/mock/sessions";
import { SessionCard } from "~/components/session-card";
import { Button } from "~/components/ui/button";
import { BadmintonSession } from "~/types/session";

// Define the loader function to fetch session data
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const sessions = getSessions();
  return json({ sessions });
};


export const meta = () => {
  return [
    { title: "羽毛球课程管理系统" },
    { name: "description", content: "羽毛球课程管理系统" },
  ];
};

export default function Index() {
  // State to control the visibility of the modal and store the session data for editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<BadmintonSession | null>(null);

  // Function to open the modal for adding a new session
  const handleAddSession = () => {
    setEditingSession(null); // Reset editing session
    setIsModalOpen(true);
  };

  // Function to open the modal for editing an existing session
  const handleEditSession = (session: BadmintonSession) => {
    setEditingSession(session);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSession(null); // Clear editing session data
  };

  // Function to handle form submission (add or edit session)
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: Handle form submission logic (add new session or update existing session)
    // You can access form data from event.target
    console.log("Form submitted!");
    handleCloseModal(); // Close modal after submission
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">课程管理</h1>
          <Button onClick={handleAddSession}>添加课程</Button>
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
            {/* Placeholder for session cards, replace with actual mapping of sessions */}
            {mockSessions.map(session => (
              <SessionCard key={session.id} session={session} onEdit={() => handleEditSession(session)}/>
            ))}
          </div>
        </div>

        <div className="md:hidden space-y-4">
          {mockSessions.map(session => (
            <SessionCard key={session.id} session={session} isMobile onEdit={() => handleEditSession(session)}/>
          ))}
        </div>

        {/* Add/Edit Session Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-xl w-1/2">
              <h2 className="text-xl font-bold mb-4">{editingSession ? "编辑课程" : "新增课程"}</h2>
              <form onSubmit={handleSubmit}>
                {/* Form Fields (based on BadmintonSession interface) */}
                <div className="mb-4">
                  <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">课程名称:</label>
                  <input type="text" id="title" name="title" defaultValue={editingSession?.title} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label htmlFor="coach" className="block text-gray-700 text-sm font-bold mb-2">教练:</label>
                  <input type="text" id="coach" name="coach" defaultValue={editingSession?.coach} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                 {/* Add other fields similarly based on BadmintonSession interface */}
                 <div className="mb-4">
                  <label htmlFor="dateTime" className="block text-gray-700 text-sm font-bold mb-2">日期时间:</label>
                  <input type="datetime-local" id="dateTime" name="dateTime" defaultValue={editingSession?.dateTime ? new Date(editingSession.dateTime).toISOString().slice(0, 16) : ""} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label htmlFor="sessionType" className="block text-gray-700 text-sm font-bold mb-2">课程类型:</label>
                  <input type="text" id="sessionType" name="sessionType" defaultValue={editingSession?.sessionType} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label htmlFor="equipment" className="block text-gray-700 text-sm font-bold mb-2">器材:</label>
                  <input type="text" id="equipment" name="equipment" defaultValue={editingSession?.equipment.join(", ")} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label htmlFor="clientType" className="block text-gray-700 text-sm font-bold mb-2">客户类型:</label>
                  <input type="text" id="clientType" name="clientType" defaultValue={editingSession?.clientType} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                <div className="mb-4">
                  <label htmlFor="courtName" className="block text-gray-700 text-sm font-bold mb-2">场地名称:</label>
                  <input type="text" id="courtName" name="courtName" defaultValue={editingSession?.courtName} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                 <div className="mb-4">
                  <label htmlFor="courtNumber" className="block text-gray-700 text-sm font-bold mb-2">场地编号:</label>
                  <input type="number" id="courtNumber" name="courtNumber" defaultValue={editingSession?.courtNumber} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>
                 <div className="mb-4">
                  <label htmlFor="totalClients" className="block text-gray-700 text-sm font-bold mb-2">总客户数:</label>
                  <input type="number" id="totalClients" name="totalClients" defaultValue={editingSession?.totalClients} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                </div>


                <div className="flex items-center justify-between">
                  <Button type="submit">{editingSession ? "保存更改" : "添加课程"}</Button>
                  <Button type="button" variant="outline" onClick={handleCloseModal}>取消</Button>
                </div>
              </form>
            </div>
          </div>
        )}</div>
}
