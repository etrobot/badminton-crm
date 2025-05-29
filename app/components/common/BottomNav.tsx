import { Link, useLocation } from "@remix-run/react";
import React from "react";
import { BookOpenIcon, UsersIcon } from 'lucide-react';
import { cn } from "~/lib/utils";

const navs = [
  { label: "课程管理", path: "/sessions", icon: <BookOpenIcon style={{marginRight:8}} size={20}/> },
  { label: "学员管理", path: "/students", icon: <UsersIcon style={{marginRight:8}} size={20}/> },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const show = location.pathname === "/sessions" || location.pathname === "/students";
  console.log('[BottomNav] 当前路径', location.pathname, '是否显示:', show);
  if (!show) return null;
  return (
    <nav
      className="fixed left-0 right-0 bottom-6 flex justify-center z-50 pointer-events-none"
    >
      <div
        className="flex bg-foreground rounded-full shadow-xl py-2 px-2 gap-6 pointer-events-auto"
      >
        {navs.map((nav) => {
          const isActive = location.pathname.startsWith(nav.path);
          return (
            <Link
              key={nav.path}
              to={nav.path}
              onClick={() => {
                console.log(`[BottomNav] 点击${nav.label}`);
              }}
              className={cn(
                "py-2 px-4 rounded-full font-medium transition-all duration-200 text-base flex items-center",
                isActive
                  ? "text-white bg-teal-600 shadow-lg shadow-teal-600/15"
                  : "text-gray-500"
              )}
            >
              {nav.icon}{nav.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;