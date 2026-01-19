import { createTaskList, getTaskLists } from "@/app/tasklists/actions";
import Link from "next/link";
import { Plus, List, ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TaskListsPage({ params }: Props) {
  const { id } = await params;
  const projectId = Number(id);

  const lists = await getTaskLists(projectId);

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Back Link */}
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Project
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Task Lists</h1>
          <p className="text-zinc-400 mt-1">Manage your task lists for this project</p>
        </div>

        {/* Create Form */}
        <form
          action={createTaskList.bind(null, projectId)}
          className="flex gap-3 bg-zinc-900/40 border-2 border-dashed border-zinc-700 rounded-xl p-4"
        >
          <input
            name="name"
            placeholder="New list name..."
            required
            className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600"
          />
          <button className="bg-white text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-zinc-100 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>

        {/* Lists */}
        {lists.length === 0 ? (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 text-center">
            <List className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No task lists yet. Create one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lists.map((list: { id: number; name: string }) => (
              <Link
                key={list.id}
                href={`/projects/${projectId}/lists/${list.id}/tasks`}
                className="block bg-zinc-900/60 border border-zinc-800 p-4 rounded-xl hover:border-zinc-700 hover:bg-zinc-900/80 transition-all text-white font-medium"
              >
                {list.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
