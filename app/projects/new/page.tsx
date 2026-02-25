"use client";

import { ArrowLeft, FolderPlus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => setUser(data));

    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(Array.isArray(data) ? data : []));
  }, []);

  const isAdmin = user?.roles?.some((r: any) => r.role.name === "ADMIN");

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error("Failed to create project");
      }

      router.push("/projects");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
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
        <form onSubmit={handleCreate} className="space-y-6">
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
              {/* Assigned To (Admin only) */}
              {isAdmin && (
                <div>
                  <label htmlFor="assignedToId" className="block text-sm font-medium text-zinc-300 mb-2">
                    Assign To User
                  </label>
                  <select
                    id="assignedToId"
                    name="assignedToId"
                    className="w-full bg-zinc-800/50 border border-zinc-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                  >
                    <option value="">Myself</option>
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}

            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-white text-zinc-900 py-3 rounded-xl font-semibold hover:bg-zinc-100 transition-all shadow-lg shadow-white/5"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </span>
            ) : (
              "Create Project"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
