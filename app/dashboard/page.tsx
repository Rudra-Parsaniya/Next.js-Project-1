import Link from "next/link";
import { getUserFromSession } from "@/lib/auth";
import { getDashboardStats } from "./actions";
import React from "react";
import {
  ArrowUpRight,
  FolderKanban,
  ListTodo,
  Clock,
  CheckCircle2,
  Plus,
  Briefcase,
  LayoutGrid,
  Calendar,
  Activity,
  TrendingUp,
  Zap
} from "lucide-react";

export default async function DashboardPage() {
  const user = await getUserFromSession();
  if (!user) return null;

  const stats = await getDashboardStats();

  const completionRate = stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* HEADER SECTION */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
              <Activity className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              {greeting}, <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">{user.name}</span>
            </h1>
            <p className="text-zinc-400 text-base">Here&apos;s what&apos;s happening with your projects today.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/projects/new"
              className="group flex items-center gap-2 bg-white text-zinc-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-all shadow-lg shadow-white/5"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              New Project
            </Link>
          </div>
        </header>

        {/* STATS ROW */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            href="/projects"
            icon={<FolderKanban className="w-5 h-5" />}
            color="indigo"
          />
          <StatCard
            title="Total Tasks"
            value={stats.totalTasks}
            href="/tasks"
            icon={<ListTodo className="w-5 h-5" />}
            color="blue"
          />
          <StatCard
            title="Pending"
            value={stats.pendingTasks}
            href="/tasks?status=PENDING"
            icon={<Clock className="w-5 h-5" />}
            color="amber"
          />
          <StatCard
            title="Completed"
            value={stats.completedTasks}
            href="/tasks?status=COMPLETED"
            icon={<CheckCircle2 className="w-5 h-5" />}
            color="emerald"
          />
        </section>

        {/* MAIN CONTENT GRID */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Progress Card */}
          <div className="lg:col-span-2 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 relative overflow-hidden">
            {/* Subtle gradient accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Performance</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">Weekly Progress</h3>
                  <p className="text-zinc-500 text-sm mt-1">Your task completion rate overview</p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-emerald-500/20 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  On Track
                </div>
              </div>

              <div className="flex items-end gap-4 mb-4">
                <span className="text-6xl font-bold text-white tracking-tighter leading-none">{completionRate}</span>
                <span className="text-3xl font-bold text-zinc-500 mb-1">%</span>
              </div>

              <div className="space-y-3">
                <div className="w-full bg-zinc-800/60 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${completionRate}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">{stats.completedTasks} of {stats.totalTasks} tasks completed</span>
                  <span className="text-emerald-400 font-medium">+12% from last week</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
              <Link href="/activity" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                View all
              </Link>
            </div>

            <div className="space-y-4">
              <ActivityItem
                title="New task created"
                description="Design system updates"
                time="2h ago"
                color="blue"
              />
              <ActivityItem
                title="Project completed"
                description="Website redesign"
                time="5h ago"
                color="emerald"
              />
              <ActivityItem
                title="Task updated"
                description="API integration"
                time="1d ago"
                color="amber"
              />
              <ActivityItem
                title="Comment added"
                description="Review feedback"
                time="2d ago"
                color="violet"
              />
            </div>
          </div>

        </section>

        {/* QUICK ACTIONS GRID */}
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              title="All Projects"
              description="View and manage workspaces"
              href="/projects"
              icon={<Briefcase className="w-5 h-5" />}
            />
            <QuickActionCard
              title="My Tasks"
              description="Check your daily todo list"
              href="/tasks"
              icon={<CheckCircle2 className="w-5 h-5" />}
            />
            <QuickActionCard
              title="Calendar"
              description="Schedule and timeline"
              href="/calendar"
              icon={<Calendar className="w-5 h-5" />}
            />
            <QuickActionCard
              title="Board View"
              description="Kanban project tracking"
              href="/board"
              icon={<LayoutGrid className="w-5 h-5" />}
            />
          </div>
        </section>

      </div>
    </div>
  );
}

// =========================================
// SUB-COMPONENTS
// =========================================

const colorMap = {
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
  violet: { bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20" },
};

function StatCard({
  title,
  value,
  href,
  icon,
  color
}: {
  title: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  color: keyof typeof colorMap;
}) {
  const colors = colorMap[color];

  return (
    <Link
      href={href}
      className="group bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 p-5 rounded-2xl hover:border-zinc-700 hover:bg-zinc-900/80 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 ${colors.bg} rounded-xl border ${colors.border}`}>
          <div className={colors.text}>{icon}</div>
        </div>
        <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
      </div>
      <div>
        <p className="text-zinc-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
      </div>
    </Link>
  );
}

function QuickActionCard({
  title,
  description,
  href,
  icon
}: {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col justify-center p-5 bg-zinc-900/40 border border-zinc-800/60 rounded-2xl hover:bg-zinc-900/70 hover:border-zinc-700 transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="text-zinc-500 group-hover:text-white transition-colors duration-200">
          {icon}
        </div>
        <h4 className="font-semibold text-zinc-300 group-hover:text-white transition-colors duration-200">
          {title}
        </h4>
      </div>
      <p className="text-xs text-zinc-600 group-hover:text-zinc-400 transition-colors duration-200">
        {description}
      </p>
    </Link>
  );
}

function ActivityItem({
  title,
  description,
  time,
  color
}: {
  title: string;
  description: string;
  time: string;
  color: keyof typeof colorMap;
}) {
  const colors = colorMap[color];

  return (
    <div className="flex items-start gap-3">
      <div className={`w-2 h-2 rounded-full ${colors.text.replace('text-', 'bg-')} mt-2 shrink-0`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-300 truncate">{title}</p>
        <p className="text-xs text-zinc-500 truncate">{description}</p>
      </div>
      <span className="text-xs text-zinc-600 shrink-0">{time}</span>
    </div>
  );
}