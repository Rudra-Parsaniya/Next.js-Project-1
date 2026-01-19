import { createProject } from "../actions";
import { redirect } from "next/navigation";
import { ArrowLeft, FolderPlus } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    await createProject(formData);
    redirect("/projects");
  }

  return (
    <div className="min-h-screen p-6 lg:p-10">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <FolderPlus className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Create Project</h1>
            <p className="text-zinc-400 mt-1">Start a new workspace for your tasks</p>
          </div>
        </div>

        {/* FORM */}
        <form action={handleCreate} className="space-y-6">
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
                placeholder="Brief description of the project..."
                rows={4}
                className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all placeholder:text-zinc-600 resize-none"
              />
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white text-zinc-900 py-3 rounded-xl font-semibold hover:bg-zinc-100 transition-all shadow-lg shadow-white/5"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
}
