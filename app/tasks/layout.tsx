import type { ReactNode } from "react";
import DashboardSidebar from "../components/sidebar/DashboardSidebar";

export default function TasksLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">

            {/* Sidebar */}
            <DashboardSidebar />

            {/* Page Content */}
            <main className="ml-72 min-h-screen">
                {children}
            </main>

        </div>
    );
}
