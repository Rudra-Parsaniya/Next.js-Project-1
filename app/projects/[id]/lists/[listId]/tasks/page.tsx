"use client";

import Link from "next/link";
import { Plus, CheckCircle2, Clock, Trash2, Save, ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Define Task type roughly matching what we expect from API
type Task = {
  id: number;
  title: string;
  description: string | null;
  status: "PENDING" | "COMPLETED";
  listId: number;
  assignedToId: number | null;
  dueDate: string | null;
  assignedTo?: {
    name: string;
    email: string;
  };
};

export default function TasksPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);
  const listId = Number(params.listId);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");

  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!listId || isNaN(listId)) return;
    fetchTasks();

    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data));

    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []));
  }, [listId]);

  const isAdmin = user?.roles?.some((r: any) => r.role.name === "ADMIN");

  async function fetchTasks() {
    try {
      setLoading(true);
      const res = await fetch(`/api/tasks?listId=${listId}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDesc,
          listId: listId,
          assignedToId: newTaskAssignedTo || null,
          dueDate: newTaskDueDate || null,
        }),
      });

      if (res.ok) {
        const newTask = await res.json();
        setTasks([...tasks, newTask]);
        setNewTaskTitle("");
        setNewTaskDesc("");
        setNewTaskAssignedTo("");
        setNewTaskDueDate("");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to create task", error);
    } finally {
      setIsCreating(false);
    }
  }

  async function handleDeleteTask(taskId: number) {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setTasks(tasks.filter((t) => t.id !== taskId));
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete task", error);
    }
  }

  async function handleToggleStatus(task: Task) {
    const newStatus: "PENDING" | "COMPLETED" = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";

    // Optimistic update
    const updatedTasks = tasks.map((t) =>
      t.id === task.id ? { ...t, status: newStatus } : t
    );
    setTasks(updatedTasks);

    try {
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        // Revert on failure
        setTasks(tasks);
      } else {
        router.refresh(); // Sync with server for stats etc.
      }
    } catch (error) {
      console.error("Failed to update status", error);
      setTasks(tasks);
    }
  }

  async function handleUpdateTask(e: React.FormEvent<HTMLFormElement>, taskId: number) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description })
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks(tasks.map(t => t.id === taskId ? updated : t));
        alert("Task updated");
      }
    } catch (error) {
      console.error("Failed to update task", error);
    }
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Back Link */}
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Project
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Tasks</h1>
          <p className="text-zinc-400 mt-1">Manage your tasks in this list</p>
        </div>

        {/* CREATE TASK */}
        <form onSubmit={handleCreateTask} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Task Title</label>
            <input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
              className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all placeholder:text-zinc-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
            <textarea
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
              placeholder="Optional details..."
              rows={3}
              className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all placeholder:text-zinc-600 resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Due Date</label>
              <input
                type="date"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer"
              />
            </div>
            {isAdmin && (
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">Assign To</label>
                <select
                  value={newTaskAssignedTo}
                  onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all cursor-pointer"
                >
                  <option value="">Myself</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button
            disabled={isCreating}
            className="bg-white text-zinc-900 px-5 py-2.5 rounded-xl font-semibold hover:bg-zinc-100 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Task
          </button>
        </form>

        {/* TASK LIST */}
        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500 mx-auto" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No tasks yet. Create one above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4 hover:border-blue-500/30 hover:shadow-md hover:shadow-blue-500/5 transition-colors"
              >
                {/* EDIT TASK */}
                <form
                  onSubmit={(e) => handleUpdateTask(e, task.id)}
                  className="space-y-3"
                >
                  <input
                    name="title"
                    defaultValue={task.title}
                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium"
                    required
                  />
                  <textarea
                    name="description"
                    defaultValue={task.description ?? ""}
                    rows={2}
                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none text-sm"
                  />
                  <button className="flex items-center gap-2 bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-zinc-700 transition-colors">
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                  {task.dueDate && (
                    <div className="flex items-center gap-2 text-xs text-amber-400 mt-2">
                      <Clock className="w-3 h-3" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  {task.assignedTo && (
                    <div className="text-xs text-blue-400 mt-1">
                      Assigned to: {task.assignedTo.name}
                    </div>
                  )}
                </form>

                {/* STATUS + DELETE */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${task.status === "COMPLETED"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                        }`}
                    >
                      {task.status === "COMPLETED" ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3" />
                          Pending
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
