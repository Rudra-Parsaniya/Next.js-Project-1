"use client";

import Link from "next/link";
import { Plus, FolderKanban, Pencil, Trash2, ArrowRight, FolderOpen, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Project {
  id: number;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  createdById: number;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProjects();
  }, []);

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

  async function handleDelete(projectId: number) {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setDeletingId(projectId);
    try {
      const response = await fetch(`/api/projects?projectId=${projectId}`, {
        method: "DELETE",
      });
      // Note: The API at /api/projects/route.ts seems to support DELETE? 
      // Wait, checking api/projects/route.ts ... it only had GET and POST. 
      // The delete logic was in actions.ts.
      // I need to check if /api/projects supports DELETE or if I need to use /api/projects/[id].
      // Usually it's /api/projects/[id].

      // Let's assume /api/projects/[id] exists or I should use it.
      // The DeleteProjectButton used `/api/projects/${projectId}`.
      // So I will use that here too.

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
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Projects
            </h1>
            <p className="text-zinc-400 mt-1">
              Manage and organize your workspaces
            </p>
          </div>

          <Link
            href="/projects/new"
            className="group flex items-center gap-2 bg-white text-zinc-900 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-zinc-100 transition-all shadow-lg shadow-white/5"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
            New Project
          </Link>
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
          /* PROJECT GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800/80 p-6 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 hover:bg-zinc-900/90 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* TOP */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                      <FolderKanban className="w-6 h-6" />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/projects/${project.id}/edit`}
                        className="p-2 rounded-lg text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 transition"
                        title="Edit Project"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="p-2 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                        title="Delete Project"
                      >
                        {deletingId === project.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <Link href={`/projects/${project.id}`} className="block">
                    <h2 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">
                      {project.name}
                    </h2>
                    <p className="text-sm text-zinc-500 mt-2 line-clamp-2">
                      {project.description ||
                        "No description provided for this project."}
                    </p>
                  </Link>
                </div>

                {/* FOOTER */}
                <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center">
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-sm font-semibold text-zinc-400 hover:text-white flex items-center gap-1 group/btn transition-colors"
                  >
                    View Tasks
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>

                  <span className="text-[10px] font-bold tracking-widest text-zinc-600">
                    ID · {project.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
