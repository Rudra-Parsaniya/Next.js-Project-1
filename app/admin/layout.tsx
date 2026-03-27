import type { ReactNode } from "react";
import DashboardSidebar from "../components/sidebar/DashboardSidebar";
import Background from "../components/Background";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Background />
      <DashboardSidebar />
      <main className="ml-72 min-h-screen">{children}</main>
    </div>
  );
}
