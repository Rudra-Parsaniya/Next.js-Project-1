"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  FolderKanban,
  ListTodo,
  TrendingUp,
  Clock,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  Search
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [latestTasks, setLatestTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          fetch("/api/admin/stats"),
          fetch("/api/admin/latest-tasks")
        ]);

        const statsData = statsRes.ok ? await statsRes.json() : null;
        const tasksData = tasksRes.ok ? await tasksRes.json() : [];

        if (statsData) setStats(statsData);
        if (Array.isArray(tasksData)) {
          setLatestTasks(tasksData);
        } else {
          setLatestTasks([]);
        }
      } catch (error) {
        console.error("Failed to fetch admin data", error);
        setLatestTasks([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen p-6 lg:p-10 relative">
      <div className="max-w-[1400px] mx-auto space-y-8 relative z-10">
        <header>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Admin <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">PowerHouse</span>
          </h1>
          <p className="text-zinc-400 text-base mt-2">Manage users, projects, and monitor enterprise performance.</p>
        </header>

        {/* STATS ROW */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Total Users"
            value={stats?.userCount || 0}
            href="/admin/users"
            icon={<Users className="w-6 h-6" />}
            color="blue"
          />
          <StatCard
            title="Total Projects"
            value={stats?.projectCount || 0}
            href="/projects"
            icon={<FolderKanban className="w-6 h-6" />}
            color="indigo"
          />
          <StatCard
            title="Total Tasks"
            value={stats?.taskCount || 0}
            href="/tasks"
            icon={<ListTodo className="w-6 h-6" />}
            color="emerald"
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LATEST ASSIGNED TASKS */}
          <div className="lg:col-span-2 bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Latest Assigned Tasks</h3>
              <Link href="/tasks" className="text-sm text-zinc-500 hover:text-white transition-colors">
                View all tasks
              </Link>
            </div>
            <div className="space-y-4">
              {latestTasks.length === 0 ? (
                <p className="text-zinc-500 text-center py-8">No tasks assigned yet.</p>
              ) : (
                latestTasks.map((task) => (
                  <div key={task.id} className="group flex items-center gap-4 p-4 rounded-xl border border-zinc-800/50 hover:bg-white/5 transition-all">
                    <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500">Assigned to:</span>
                        <span className="text-xs text-blue-400 font-medium">{task.assignedTo?.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider ${task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' :
                        task.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-500/10 text-zinc-400'
                        }`}>
                        {task.status}
                      </span>
                      <p className="text-[10px] text-zinc-600 mt-1">{new Date(task.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* QUICK LINKS / UTILITIES */}
          <div className="space-y-6">
            <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 gap-3">
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                >
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Users className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-zinc-300">Manage Users</span>
                </Link>
                <Link
                  href="/projects"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-all"
                >
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-zinc-300">Global Projects</span>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
              <TrendingUp className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Growth Overview</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                You have {stats?.userCount || 0} active employees across {stats?.projectCount || 0} projects. Performance is up 12% this month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, href, icon, color }: any) {
  const colors: any = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    indigo: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[color]} backdrop-blur-sm relative overflow-hidden group`}>
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-sm font-medium opacity-70 mb-1">{title}</p>
          <h3 className="text-4xl font-bold tracking-tight">{value}</h3>
        </div>
        <div className="p-3 bg-white/10 rounded-xl">
          {icon}
        </div>
      </div>
      <Link href={href} className="flex items-center gap-1 mt-4 text-xs font-semibold hover:gap-2 transition-all relative z-10">
        View Details <ArrowUpRight className="w-3 h-3" />
      </Link>
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:scale-150 transition-transform duration-500 ${color === 'blue' ? 'bg-blue-400' : color === 'indigo' ? 'bg-indigo-400' : 'bg-emerald-400'} rounded-full blur-3xl`} />
    </div>
  );
}
