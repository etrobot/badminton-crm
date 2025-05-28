import React from "react";

interface TagProps {
  color: string;
  children: React.ReactNode;
}

export default function Tag({ color, children }: TagProps) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
      {children}
    </span>
  );
}