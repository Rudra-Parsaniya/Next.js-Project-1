import DashboardSidebar from "../components/sidebar/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100">
      
      <DashboardSidebar />

      {/* Main Content */}
      <main className="ml-72 min-h-screen overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
