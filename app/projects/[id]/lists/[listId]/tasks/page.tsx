import {
  createTask,
  getTasks,
  deleteTask,
  updateTaskStatus,
  updateTask,
} from "@/app/tasks/actions";
import Link from "next/link";
import { Plus, CheckCircle2, Clock, Trash2, Save, ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ id: string; listId: string }>;
};

export default async function TasksPage({ params }: Props) {
  const { id, listId } = await params;
  const projectId = Number(id);
  const listID = Number(listId);

  const tasks = await getTasks(listID);

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
        <form action={createTask.bind(null, listID)} className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Task Title</label>
            <input
              name="title"
              placeholder="What needs to be done?"
              required
              className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all placeholder:text-zinc-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
            <textarea
              name="description"
              placeholder="Optional details..."
              rows={3}
              className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-all placeholder:text-zinc-600 resize-none"
            />
          </div>
          <button className="bg-white text-zinc-900 px-5 py-2.5 rounded-xl font-semibold hover:bg-zinc-100 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </form>

        {/* TASK LIST */}
        {tasks.length === 0 ? (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 text-center">
            <CheckCircle2 className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No tasks yet. Create one above.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4 hover:border-zinc-700 transition-colors"
              >
                {/* EDIT TASK */}
                <form
                  action={updateTask.bind(null, task.id)}
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
                </form>

                {/* STATUS + DELETE */}
                <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                  <div className="flex items-center gap-2">
                    <form
                      action={updateTaskStatus.bind(
                        null,
                        task.id,
                        task.status === "COMPLETED" ? "PENDING" : "COMPLETED"
                      )}
                    >
                      <button
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
                    </form>
                  </div>

                  <form action={deleteTask.bind(null, task.id)}>
                    <button className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
