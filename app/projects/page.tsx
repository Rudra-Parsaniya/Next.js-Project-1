import Link from "next/link";
import { getProjects, deleteProject } from "./actions";
import {
  PlusIcon,
  FolderIcon,
  PencilSquareIcon,
  TrashIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-slate-50 to-slate-100 relative overflow-hidden">
      
      {/* Animated background (same language as Dashboard) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl animate-[floatRandom1_18s_ease-in-out_infinite]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-green-200/30 rounded-full blur-3xl animate-[floatRandom2_22s_ease-in-out_infinite]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-[floatRandom3_20s_ease-in-out_infinite]" />
      </div>

      <style>{`
        @keyframes floatRandom1 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(120px, 80px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes floatRandom2 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(-120px, 100px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes floatRandom3 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(80px, -120px); }
          100% { transform: translate(0, 0); }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10 space-y-10">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700">
              Projects
            </h1>
            <p className="text-slate-600 mt-2">
              Manage and organize your workspaces
            </p>
          </div>

          <Link
            href="/projects/new"
            className="inline-flex items-center gap-2 bg-gradient-to-br from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <PlusIcon className="w-5 h-5" />
            New Project
          </Link>
        </div>

        {/* EMPTY STATE */}
        {projects.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-dashed border-slate-200 p-16 text-center shadow-lg shadow-slate-200/40">
            <FolderIcon className="w-16 h-16 text-slate-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-slate-900">
              No projects yet
            </h3>
            <p className="text-slate-500 mt-2 mb-6">
              Create your first project to get started.
            </p>
            <Link
              href="/projects/new"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
            >
              Create Project <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          /* PROJECT GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white/70 backdrop-blur-xl rounded-2xl border border-white/60 p-6 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* TOP */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl text-blue-700 shadow-sm">
                      <FolderIcon className="w-6 h-6" />
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/projects/${project.id}/edit`}
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition"
                        title="Edit Project"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </Link>
                      <form action={deleteProject}>
                        <input type="hidden" name="projectId" value={project.id} />
                        <button
                          type="submit"
                          className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Project"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <Link href={`/projects/${project.id}`} className="block">
                    <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h2>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                      {project.description ||
                        "No description provided for this project."}
                    </p>
                  </Link>
                </div>

                {/* FOOTER */}
                <div className="mt-6 pt-4 border-t border-slate-200/60 flex justify-between items-center">
                  <Link
                    href={`/projects/${project.id}`}
                    className="text-sm font-semibold text-blue-600 flex items-center gap-1 group/btn"
                  >
                    View Tasks
                    <ArrowRightIcon className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>

                  <span className="text-[10px] font-bold tracking-widest text-slate-400">
                    ID · {project.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
