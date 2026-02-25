"use client";

import Link from "next/link";
import { Plus, List, ArrowLeft, Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type TaskList = {
  id: number;
  name: string;
};

export default function TaskListsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);

  const [lists, setLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState("");

  useEffect(() => {
    if (!projectId || isNaN(projectId)) return;

    fetch(`/api/tasklists?projectId=${projectId}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch");
      })
      .then((data) => setLists(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [projectId]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch("/api/tasklists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newListName, projectId }),
      });

      if (res.ok) {
        const newList = await res.json();
        setLists([...lists, newList]);
        setNewListName("");
        router.refresh();
      }
    } catch (error) {
      console.error("Create failed", error);
    } finally {
      setIsCreating(false);
    }
  }

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
          onSubmit={handleCreate}
          className="flex gap-3 bg-zinc-900/40 border-2 border-dashed border-zinc-700 rounded-xl p-4"
        >
          <input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="New list name..."
            required
            className="flex-1 bg-transparent text-white outline-none placeholder:text-zinc-600"
          />
          <button
            disabled={isCreating}
            className="bg-white text-zinc-900 px-4 py-2 rounded-lg font-medium hover:bg-zinc-100 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add
          </button>
        </form>

        {/* Lists */}
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500 mx-auto" />
          </div>
        ) : lists.length === 0 ? (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-8 text-center">
            <List className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500">No task lists yet. Create one above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lists.map((list) => (
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
