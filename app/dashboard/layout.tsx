import DashboardSidebar from "../components/sidebar/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      <DashboardSidebar />

      {/* Main Content */}
      <main className="ml-72 min-h-screen">
        {children}
      </main>

    </div>
  );
}
