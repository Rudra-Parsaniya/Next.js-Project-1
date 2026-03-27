"use client";

import Link from "next/link";
import { Plus, CheckCircle2, Clock, Trash2, Save, ArrowLeft, Loader2, Upload, ExternalLink, XCircle, FileText } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

// Define Task type matching the updated Prisma schema
type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | "UPLOADED" | "RE_SUBMISSION";

type Task = {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  listId: number;
  assignedToId: number | null;
  dueDate: string | null;
  submissionUrl?: string | null;
  assignedTo?: {
    id: number;
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
  const [uploadingId, setUploadingId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  async function updateTaskStatus(taskId: number, newStatus: TaskStatus, submissionUrl?: string) {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, submissionUrl }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks(tasks.map(t => t.id === taskId ? updated : t));
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update status", error);
    }
  }

  async function handleFileUpload(taskId: number, file: File) {
    setUploadingId(taskId);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("taskId", taskId.toString());

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { submissionUrl } = await res.json();
        await updateTaskStatus(taskId, "UPLOADED", submissionUrl);
        alert("File uploaded successfully!");
      } else {
        alert("Failed to upload file");
      }
    } catch (error) {
      console.error("Upload Error:", error);
    } finally {
      setUploadingId(null);
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

  const getStatusDisplay = (status: TaskStatus) => {
    switch (status) {
      case "COMPLETED": return { label: "Completed", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <CheckCircle2 className="w-3 h-3" /> };
      case "UPLOADED": return { label: "Uploaded", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <Upload className="w-3 h-3" /> };
      case "RE_SUBMISSION": return { label: "Re-submission Required", color: "bg-red-500/10 text-red-400 border-red-500/20", icon: <XCircle className="w-3 h-3" /> };
      default: return { label: "Pending", color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <Clock className="w-3 h-3" /> };
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Back Link */}
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Project
        </Link>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Tasks</h1>
            <p className="text-zinc-400 mt-1">Manage deliverables and submissions</p>
          </div>
        </div>

        {/* CREATE TASK (ADMIN ONLY) */}
        {isAdmin && (
          <form onSubmit={handleCreateTask} className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-2">
              <Plus className="w-5 h-5 text-emerald-400" /> Create New Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4 md:col-span-2">
                <input
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Task title..."
                  required
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600"
                />
                <textarea
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Assignment instructions..."
                  rows={2}
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-zinc-600 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Due Date</label>
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Assign To</label>
                <select
                  value={newTaskAssignedTo}
                  onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                  className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all cursor-pointer"
                >
                  <option value="">Myself</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <button
              disabled={isCreating}
              className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Assign Task
            </button>
          </form>
        )}

        {/* TASK LIST */}
        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-emerald-500 mx-auto" />
            </div>
          ) : tasks.length === 0 ? (
            <div className="bg-zinc-900/40 border-2 border-dashed border-zinc-800 rounded-2xl p-20 text-center">
              <FileText className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-500 font-medium italic">No assignments found in this list.</p>
            </div>
          ) : (
            tasks.map((task) => {
              const status = getStatusDisplay(task.status);
              const isAssignedToMe = task.assignedToId === user?.id;

              return (
                <div
                  key={task.id}
                  className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 transition-all hover:border-zinc-700 relative group overflow-hidden shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                    <div className="flex-1 space-y-4">
                      {/* TASK INFO */}
                      <div>
                        {isAdmin ? (
                          <form
                            onSubmit={(e) => handleUpdateTask(e, task.id)}
                            className="space-y-3"
                          >
                            <input
                              name="title"
                              defaultValue={task.title}
                              className="w-full bg-transparent border-none text-xl font-bold text-white p-0 focus:ring-0"
                            />
                            <textarea
                              name="description"
                              defaultValue={task.description ?? ""}
                              className="w-full bg-transparent border-none text-zinc-400 p-0 focus:ring-0 text-sm resize-none"
                              rows={2}
                            />
                            <button className="hidden group-hover:flex items-center gap-2 bg-zinc-800/50 text-zinc-400 px-3 py-1 rounded-lg text-xs hover:bg-zinc-700 hover:text-white transition-all">
                              <Save className="w-3 h-3" /> Save Changes
                            </button>
                          </form>
                        ) : (
                          <>
                            <h3 className="text-xl font-bold text-white">{task.title}</h3>
                            <p className="text-zinc-400 text-sm mt-1">{task.description || "No specific instructions provided."}</p>
                          </>
                        )}
                      </div>

                      {/* TASK METADATA */}
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                        {task.dueDate && (
                          <div className="flex items-center gap-2 text-amber-500/80">
                            <Clock className="w-3.5 h-3.5" /> Due: {new Date(task.dueDate).toLocaleDateString()}
                          </div>
                        )}
                        {task.assignedTo && (
                          <div className="flex items-center gap-2 text-blue-400/80">
                            <Users className="w-3.5 h-3.5" /> {task.assignedTo.name}
                          </div>
                        )}
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${status.color}`}>
                          {status.icon} {status.label}
                        </span>
                      </div>

                      {/* SUBMISSION DISPLAY */}
                      {task.submissionUrl && (
                        <div className="flex items-center gap-3 p-3 bg-zinc-800/40 rounded-xl border border-zinc-700/50 w-fit">
                          <FileText className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-xs font-bold text-zinc-300">Submitted Deliverable</p>
                            <Link
                              href={task.submissionUrl}
                              target="_blank"
                              className="text-xs text-blue-400 hover:underline flex items-center gap-1 mt-0.5"
                            >
                              View Document <ExternalLink className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex md:flex-col gap-2 shrink-0">
                      {/* UPLOAD BUTTON (USER) */}
                      {!isAdmin && isAssignedToMe && (task.status === "PENDING" || task.status === "RE_SUBMISSION") && (
                        <>
                          <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            accept=".pdf,.doc,.docx,.zip"
                            onChange={(e) => e.target.files?.[0] && handleFileUpload(task.id, e.target.files[0])}
                          />
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadingId === task.id}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                          >
                            {uploadingId === task.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            Upload Work
                          </button>
                        </>
                      )}

                      {/* REVIEW ACTIONS (ADMIN) */}
                      {isAdmin && task.status === "UPLOADED" && (
                        <div className="space-y-2 flex flex-col">
                          <button
                            onClick={() => updateTaskStatus(task.id, "COMPLETED")}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Approve
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task.id, "RE_SUBMISSION")}
                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20"
                          >
                            <XCircle className="w-4 h-4" /> Reject (Re-submit)
                          </button>
                        </div>
                      )}

                      {/* DELETE (ADMIN) */}
                      {isAdmin && (
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-3 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all self-end md:self-auto"
                          title="Discard Task"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div className={`absolute top-0 right-0 w-24 h-24 blur-[80px] -z-0 opacity-20 pointer-events-none transition-colors ${task.status === "COMPLETED" ? "bg-emerald-500" : task.status === "UPLOADED" ? "bg-blue-500" : task.status === "RE_SUBMISSION" ? "bg-red-500" : "bg-amber-500"}`} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
