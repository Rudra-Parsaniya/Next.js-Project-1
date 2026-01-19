import type { ReactNode } from "react";
import DashboardSidebar from "../components/sidebar/DashboardSidebar";

export default function ProjectsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100">
      
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Page Content */}
      <main className="ml-72 min-h-screen overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
