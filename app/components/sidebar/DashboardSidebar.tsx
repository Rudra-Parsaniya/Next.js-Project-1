'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, FolderKanban, ListTodo, LogOut } from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/app/dashboard/logout-action";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
    } catch (error) {
      setIsLoggingOut(false);
      console.error("Logout error:", error);
    }
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/users/me", label: "Profile", icon: User },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/tasks", label: "Tasks", icon: ListTodo },
  ];

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200/60 flex flex-col z-50 overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-2xl animate-[floatRandom1_15s_ease-in-out_infinite]" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-green-300/20 rounded-full mix-blend-multiply filter blur-2xl animate-[floatRandom2_18s_ease-in-out_infinite]" />
        <div className="absolute -bottom-32 left-1/4 w-56 h-56 bg-blue-300/15 rounded-full mix-blend-multiply filter blur-2xl animate-[floatRandom3_16s_ease-in-out_infinite]" />
      </div>

      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-200/60 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">NP</span>
          </div>
          <div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700">
              Notes
            </h1>
            <span className="text-xs text-slate-500 font-medium">Pro</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2 relative z-10">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              isActive(href)
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30"
                : "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-slate-200/60 relative z-10">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-red-50 hover:text-red-600 transition disabled:opacity-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">
            {isLoggingOut ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </aside>
  );
}
