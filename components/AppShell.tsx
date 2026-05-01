"use client";

import Sidebar from "./Sidebar";
import { useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="shell">
      <button className="menu-btn" onClick={() => setOpen(!open)}>
        ☰
      </button>

      <div className={`sidebar-wrap ${open ? "open" : ""}`}>
        <Sidebar />
      </div>

      <div className="content">{children}</div>
    </div>
  );
}