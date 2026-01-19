import Link from "next/link";
import { getProjectById, updateProject } from "./actions";
import {
  getTaskLists,
  createTaskList,
  deleteTaskList,
} from "@/app/tasklists/actions";
import DeleteProjectButton from "./DeleteProjectButton";
import { Plus, Trash2, ArrowLeft, CheckCircle2, ListTodo, TrendingUp } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const projectId = Number(id);

  if (!id || Number.isNaN(projectId)) {
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

  const project = await getProjectById(projectId);
  const taskLists = await getTaskLists(projectId);

  /* ===============================
     PROJECT STATS
  =============================== */
  const { prisma } = await import("@/lib/prisma");
  const stats = await prisma.$transaction(async (tx) => {
    const totalTasks = await tx.task.count({
      where: { list: { projectId } },
    });
    const completedTasks = await tx.task.count({
      where: { status: "COMPLETED", list: { projectId } },
    });
    const pendingTasks = await tx.task.count({
      where: { status: "PENDING", list: { projectId } },
    });
    return { totalTasks, completedTasks, pendingTasks };
  });

  const completionRate =
    stats.totalTasks > 0
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
              action={createTaskList}
              className="flex gap-3 bg-zinc-900/40 border-2 border-dashed border-zinc-700 rounded-xl p-4"
            >
              <input type="hidden" name="projectId" value={projectId} />
              <input
                name="name"
                placeholder="New task list name..."
                className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600"
                required
              />
              <button className="bg-white text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-zinc-100 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
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
                    className="bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800 p-4 flex justify-between items-center hover:border-zinc-700 transition-colors"
                  >
                    <Link
                      href={`/projects/${projectId}/lists/${list.id}/tasks`}
                      className="font-semibold text-white hover:text-indigo-400 transition-colors"
                    >
                      {list.name}
                    </Link>

                    <form action={deleteTaskList}>
                      <input type="hidden" name="listId" value={list.id} />
                      <input type="hidden" name="projectId" value={projectId} />
                      <button className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
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
              <p className="text-xs text-zinc-500">{stats.completedTasks} of {stats.totalTasks} tasks</p>
            </div>

            {/* SETTINGS */}
            <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border border-zinc-800 p-6">
              <h3 className="font-semibold text-white mb-4">Settings</h3>

              <form action={updateProject} className="space-y-4">
                <input type="hidden" name="projectId" value={projectId} />

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">Name</label>
                  <input
                    name="name"
                    defaultValue={project.name}
                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-2">Description</label>
                  <textarea
                    name="description"
                    defaultValue={project.description ?? ""}
                    rows={4}
                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
                  />
                </div>

                <button className="w-full bg-indigo-500 text-white py-2 rounded-lg font-medium hover:bg-indigo-600 transition-colors">
                  Save Changes
                </button>
              </form>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
