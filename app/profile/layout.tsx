import DashboardSidebar from "../components/sidebar/DashboardSidebar";
import Background from "../components/Background";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <Background />
            <DashboardSidebar />
            {/* Main Content */}
            <main className="ml-72 min-h-screen">
                {children}
            </main>
        </div>
    );
}
