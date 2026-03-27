"use client";

import Link from "next/link";
import { Plus, FolderKanban, Pencil, Trash2, ArrowRight, FolderOpen, Loader2, Search, Users, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  createdBy?: {
    id: number;
    name: string;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function init() {
      await Promise.all([fetchProjects(), fetchUser()]);
    }
    init();
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  }

  async function fetchProjects() {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error("Failed to fetch projects", error);
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = currentUser?.roles?.some((r: any) => r.role.name === "ADMIN");

  async function handleDelete(projectId: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeletingId(projectId);
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE"
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
        router.refresh();
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Failed to delete project", error);
      alert("Something went wrong");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProjects = Array.isArray(projects) ? projects.filter(project =>
    (project.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (project.createdBy?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              Projects
            </h1>
            <p className="text-zinc-400 mt-1">
              Manage and organize your workspaces
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/projects/new"
              className="group flex items-center gap-2 bg-white text-zinc-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-all shadow-lg shadow-white/5"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              New Project
            </Link>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Search projects..."
                className="bg-black/40 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full md:w-64 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* EMPTY STATE */}
        {projects.length === 0 ? (
          <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-zinc-700 p-16 text-center">
            <FolderOpen className="w-16 h-16 text-zinc-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No projects yet
            </h3>
            <p className="text-zinc-500 mb-6">
              Create your first project to get started.
            </p>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 text-white font-semibold hover:text-zinc-300 transition-colors"
            >
              Create Project <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* PROJECT TABLE */
          <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-800/50 bg-white/5">
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Project Info</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Description</th>
                    {isAdmin && (
                      <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Owner</th>
                    )}
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest">Created</th>
                    <th className="px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/30">
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                            <FolderKanban className="w-5 h-5" />
                          </div>
                          <div>
                            <Link href={`/projects/${project.id}`} className="text-sm font-semibold text-white hover:text-indigo-400 transition-colors">
                              {project.name}
                            </Link>
                            <p className="text-[10px] text-zinc-600 font-bold tracking-widest mt-0.5">ID: {project.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-zinc-500 line-clamp-1 max-w-[200px]">
                          {project.description || "No description provided."}
                        </p>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                              {project.createdBy?.name?.charAt(0) || "?"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{project.createdBy?.name || "Unknown"}</p>
                              <p className="text-[10px] text-zinc-500">UID: {project.createdBy?.id || "N/A"}</p>
                            </div>
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 text-xs text-zinc-500 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-zinc-600" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/projects/${project.id}`}
                            className="p-2 hover:bg-blue-500/10 text-zinc-500 hover:text-blue-400 rounded-lg transition-all"
                            title="View Tasks"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/projects/${project.id}/edit`}
                            className="p-2 hover:bg-amber-500/10 text-zinc-500 hover:text-amber-400 rounded-lg transition-all"
                            title="Edit Project"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(project.id)}
                            disabled={deletingId === project.id}
                            className="p-2 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-all disabled:opacity-50"
                            title="Delete Project"
                          >
                            {deletingId === project.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProjects.length === 0 && (
                <div className="p-20 text-center">
                  <FolderOpen className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <p className="text-zinc-500">No projects found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
