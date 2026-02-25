"use client";

import { ArrowLeft, FolderPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Project = {
  id: number;
  name: string;
  description: string | null;
};

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params.id);

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!projectId || isNaN(projectId)) return;

    fetch(`/api/projects/${projectId}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch");
      })
      .then((data) => setProject(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [projectId]);

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const description = formData.get("description");

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });

      if (res.ok) {
        router.push(`/projects/${projectId}`);
        router.refresh();
      } else {
        alert("Failed to update project");
      }
    } catch (error) {
      console.error("Update failed", error);
      alert("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  }

  if (isNaN(projectId)) {
    return <div className="p-6 text-red-500">Invalid project ID</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  if (!project) {
    return <div className="p-6 text-white">Project not found</div>;
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Back Link */}
        <Link href={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Project
        </Link>

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <FolderPlus className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Edit Project</h1>
            <p className="text-zinc-400 mt-1">Make changes to your project</p>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-2xl p-6 space-y-6">

            {/* Project Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
                Project Name <span className="text-red-400">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                defaultValue={project.name}
                placeholder="e.g., Website Redesign"
                required
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-zinc-300 mb-2">
                Description <span className="text-zinc-600">(optional)</span>
              </label>
              <textarea
                id="description"
                name="description"
                defaultValue={project.description ?? ""}
                placeholder="Brief description of the project..."
                rows={4}
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-zinc-600 resize-none"
              />
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-white text-zinc-900 py-3 rounded-xl font-semibold hover:bg-zinc-100 transition-all shadow-lg shadow-white/5 disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isSaving ? "Updating..." : "Update Project"}
          </button>
        </form>
      </div>
    </div>
  );
}
