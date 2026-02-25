"use client";

import Link from "next/link";
import DeleteProjectButton from "./DeleteProjectButton";
import { Plus, Trash2, ArrowLeft, TrendingUp, ListTodo, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Project = {
  id: number;
  name: string;
  description: string | null;
  createdById: number;
};

type TaskList = {
  id: number;
  name: string;
  projectId: number;
};

type Stats = {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [stats, setStats] = useState<Stats | null>(null); // Stats fetching needs a dedicated endpoint or calculation logic
  // Since we don't have a direct "project stats" endpoint (only global dashboard stats or manual calc), 
  // we might need to fetch tasks to calculate stats or add an endpoint.
  // For now, let's just fetch tasks for the project to calculate stats or if we can't easily, we might skip stats or fetch all tasks.
  // Wait, the original code fetched all tasks via prisma.$transaction to calc stats.
  // I should probably create a specific API endpoint for this or fetch all tasks client side.
  // Fetching all tasks client side is easier given we have GET /api/tasks?listId=... but we need by projectId.
  // The GET /api/tasks endpoint filters by listId, or user.id (all tasks).
  // I can fetch all user tasks and filter by project... but that's inefficient.
  // Better approach: Let's assume for now I will focus on Project/Lists CRUD. Stats might be zero or loading until we fix that.
  // Actually, I can add a quick endpoint creation to my plan if needed, but the user asked for "project crud and task crud".

  const [loading, setLoading] = useState(true);
  const [isCreatingList, setIsCreatingList] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    if (!projectId || isNaN(projectId)) return;

    fetchData();
  }, [projectId]);

  async function fetchData() {
    try {
      setLoading(true);
      const [projectRes, listsRes, allTasksRes] = await Promise.all([
        fetch(`/api/projects/${projectId}`),
        fetch(`/api/tasklists?projectId=${projectId}`),
        fetch(`/api/tasks`) // Fetching all tasks to calc stats locally for now. Optimization: Add specific API later.
      ]);

      if (projectRes.ok) {
        const data = await projectRes.json();
        setProject(data);
      }

      if (listsRes.ok) {
        const data = await listsRes.json();
        setTaskLists(data);
      }

      if (allTasksRes.ok) {
        const tasks = await allTasksRes.json();
        // Calc stats client side for this project
        // We need to know which lists belong to this project.
        // But we just fetched lists.
        // Wait, fetching ALL tasks for the user might be heavy. 
        // But /api/tasks returns all tasks for the user.
        // Filter tasks that belong to one of the taskLists.
        // This relies on `listsRes` completing first or using the data we just got.
        // Actually, promises run in parallel. 

        // Let's refactor:
        // We need the lists first to know which tasks are relevant if the tasks don't have projectId populated directly (they have list->project).
        // The tasks returned by /api/tasks DO include list->project.

        const projectTasks = tasks.filter((t: any) => t.list?.project?.id === projectId);

        const total = projectTasks.length;
        const completed = projectTasks.filter((t: any) => t.status === "COMPLETED").length;
        const pending = projectTasks.filter((t: any) => t.status === "PENDING").length;

        setStats({
          totalTasks: total,
          completedTasks: completed,
          pendingTasks: pending
        });
      }

    } catch (error) {
      console.error("Failed to fetch project data", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateList(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim()) return;

    setIsCreatingList(true);
    try {
      const res = await fetch("/api/tasklists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName, projectId })
      });

      if (res.ok) {
        const newList = await res.json();
        setTaskLists([...taskLists, newList]);
        setNewListName("");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create list", error);
    } finally {
      setIsCreatingList(false);
    }
  }

  async function handleDeleteList(listId: number) {
    if (!confirm("Delete this list and all its tasks?")) return;

    // Use DELETE method on /api/tasklists (it expects body with listId according to my read of route.ts, wait... DELETE usually shouldn't have body standardly but Next.js supports it... 
    // ACTUALLY the route.ts I read for DELETE in tasklists took `body`. 
    // `const body = await request.json(); const { listId } = body;`
    // This is non-standard for DELETE but commonly works. 
    // Better practice would be DELETE /api/tasklists/[id] but I verified the route.ts code already.

    try {
      const res = await fetch("/api/tasklists", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listId })
      });

      if (res.ok) {
        setTaskLists(taskLists.filter(l => l.id !== listId));
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete list", error);
    }
  }

  async function handleUpdateProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!project) return;

    setIsUpdating(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
      });

      if (res.ok) {
        const updated = await res.json();
        setProject(updated);
        alert("Project updated successfully");
      }
    } catch (error) {
      console.error("Failed to update project", error);
    } finally {
      setIsUpdating(false);
    }
  }


  if (isNaN(projectId)) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Invalid Project ID
          </h2>
          <Link href="/projects" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  if (loading || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  const completionRate = stats && stats.totalTasks > 0
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* HEADER */}
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                {project.name}
              </h1>
              {project.description && (
                <p className="text-zinc-400 mt-2 max-w-3xl">
                  {project.description}
                </p>
              )}
            </div>

            <DeleteProjectButton projectId={projectId} />
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* TASK LISTS */}
          <div className="lg:col-span-3 space-y-6">

            {/* CREATE LIST */}
            <form
              onSubmit={handleCreateList}
              className="flex gap-3 bg-zinc-900/40 border-2 border-dashed border-zinc-700 rounded-xl p-4"
            >
              <input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="New task list name..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600"
                required
              />
              <button
                type="submit"
                disabled={isCreatingList}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-500 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isCreatingList ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add
              </button>
            </form>

            {/* LISTS */}
            {taskLists.length === 0 ? (
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 text-center">
                <ListTodo className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-500">No task lists yet. Create one above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {taskLists.map((list) => (
                  <div
                    key={list.id}
                    className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800 p-4 flex justify-between items-center hover:border-blue-500/30 hover:bg-zinc-900/80 transition-colors"
                  >
                    <Link
                      href={`/projects/${projectId}/lists/${list.id}/tasks`}
                      className="font-semibold text-white hover:text-indigo-400 transition-colors"
                    >
                      {list.name}
                    </Link>

                    <button
                      onClick={() => handleDeleteList(list.id)}
                      className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-6">

            {/* PROGRESS */}
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Progress</span>
              </div>
              <p className="text-5xl font-bold text-white mb-2">
                {completionRate}%
              </p>
              <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <p className="text-xs text-zinc-500">
                {stats ? stats.completedTasks : 0} of {stats ? stats.totalTasks : 0} tasks
              </p>
            </div>

            {/* SETTINGS */}
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6">
              <h3 className="font-semibold text-white mb-4">Settings</h3>

              <form onSubmit={handleUpdateProject} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">Name</label>
                  <input
                    name="name"
                    defaultValue={project.name}
                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">Description</label>
                  <textarea
                    name="description"
                    defaultValue={project.description ?? ""}
                    rows={4}
                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
                  />
                </div>

                <button
                  disabled={isUpdating}
                  className="w-full bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50"
                >
                  {isUpdating ? "Saving..." : "Save Changes"}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
