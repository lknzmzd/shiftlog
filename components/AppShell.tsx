import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="shell">
      <Sidebar />
      <div className="content">{children}</div>
    </div>
  );
}