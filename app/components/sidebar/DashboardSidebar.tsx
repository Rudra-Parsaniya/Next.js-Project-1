'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, User, FolderKanban, ListTodo, LogOut, Settings, HelpCircle } from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/app/dashboard/logout-action";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutAction();
    } catch (error) {
      setIsLoggingOut(false);
      console.error("Logout error:", error);
    }
  };

  const mainNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: FolderKanban },
    { href: "/tasks", label: "Tasks", icon: ListTodo },
  ];

  const secondaryNavItems = [
    { href: "/users/me", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className="fixed left-0 top-0 w-72 h-screen bg-zinc-950 border-r border-zinc-800/80 flex flex-col z-50">

      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-white/10 to-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
            <span className="text-white font-bold text-sm">NP</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              NotesPro
            </h1>
            <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Dashboard</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <div className="space-y-1">
          {mainNavItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive(href)
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                }`}
            >
              <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive(href) ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`} />
              <span className="text-sm font-medium">{label}</span>
              {isActive(href) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-zinc-800/80" />

        {/* Secondary Navigation */}
        <div className="space-y-1">
          <p className="px-4 mb-2 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Account</p>
          {secondaryNavItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive(href)
                  ? "bg-white/10 text-white"
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                }`}
            >
              <Icon className={`w-4 h-4 transition-colors duration-200 ${isActive(href) ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`} />
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Help & Logout Section */}
      <div className="px-4 py-4 border-t border-zinc-800/80 space-y-1">
        <Link
          href="/help"
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:bg-white/5 hover:text-zinc-300 transition-all duration-200"
        >
          <HelpCircle className="w-4 h-4" />
          <span className="text-sm font-medium">Help & Support</span>
        </Link>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 disabled:opacity-50"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isLoggingOut ? "Logging out..." : "Log out"}
          </span>
        </button>
      </div>
    </aside>
  );
}
