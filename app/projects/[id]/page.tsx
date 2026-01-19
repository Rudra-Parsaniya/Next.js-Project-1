import Link from "next/link";
import { getProjectById, updateProject } from "./actions";
import {
  getTaskLists,
  createTaskList,
  deleteTaskList,
} from "@/app/tasklists/actions";
import DeleteProjectButton from "./DeleteProjectButton";
import {
  PlusIcon,
  TrashIcon,
  FolderIcon,
  ArrowLeftIcon,
  CheckCircle2,
  Clock,
  ListTodo,
  Plus,
  ArrowUpRight,
} from "@heroicons/react/24/outline";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const projectId = Number(id);

  if (!id || Number.isNaN(projectId)) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-8 border border-slate-200 text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            Invalid Project ID
          </h2>
          <Link href="/projects" className="text-blue-600 font-semibold">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const project = await getProjectById(projectId);
  const taskLists = await getTaskLists(projectId);

  /* ===============================
     PROJECT STATS (unchanged)
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
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

      {/* HEADER */}
      <div>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Projects
        </Link>

        <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              {project.name}
            </h1>
            {project.description && (
              <p className="text-slate-600 mt-3 max-w-3xl">
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
            className="flex gap-3 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl p-4"
          >
            <input type="hidden" name="projectId" value={projectId} />
            <input
              name="name"
              placeholder="New task list"
              className="flex-1 bg-transparent outline-none"
              required
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              <PlusIcon className="w-5 h-5" />
            </button>
          </form>

          {/* LISTS */}
          {taskLists.map((list) => (
            <div
              key={list.id}
              className="bg-white rounded-xl border border-slate-200 p-4 flex justify-between items-center"
            >
              <Link
                href={`/projects/${projectId}/lists/${list.id}/tasks`}
                className="font-semibold text-slate-900 hover:text-blue-600"
              >
                {list.name}
              </Link>

              <form action={deleteTaskList}>
                <input type="hidden" name="listId" value={list.id} />
                <input type="hidden" name="projectId" value={projectId} />
                <button className="text-red-500 hover:text-red-600">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </form>
            </div>
          ))}
        </div>

        {/* RIGHT SIDEBAR */}
        <aside className="space-y-6">

          {/* PROGRESS */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <p className="text-sm text-slate-600 mb-2">Completion</p>
            <p className="text-4xl font-bold text-green-600">
              {completionRate}%
            </p>
          </div>

          {/* SETTINGS (FIXED ACTION) */}
          <div className="bg-white rounded-2xl p-6 shadow">
            <h3 className="font-bold mb-4 text-gray-800">Settings</h3>

            {/* ✅ CORRECT SERVER ACTION */}
            <form action={updateProject} className="space-y-4">
              <input type="hidden" name="projectId" value={projectId} />

              <input
                name="name"
                defaultValue={project.name}
                className="w-full border rounded-lg px-3 py-2 text-gray-400"
                required
              />

              <textarea
                name="description"
                defaultValue={project.description ?? ""}
                rows={4}
                className="w-full border rounded-lg px-3 py-2 text-gray-400"
              />

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                Save Changes
              </button>
            </form>
          </div>
        </aside>
      </div>
    </div>
  );
}
