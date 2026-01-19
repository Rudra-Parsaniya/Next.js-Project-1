"use client";

import { deleteProject } from "./actions";
import { Trash2 } from "lucide-react";

type Props = {
  projectId: number;
};

export default function DeleteProjectButton({ projectId }: Props) {
  return (
    <form
      action={deleteProject.bind(null, projectId)}
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this project?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl font-medium hover:bg-red-500/20 transition-colors"
      >
        <Trash2 className="w-4 h-4" />
        Delete Project
      </button>
    </form>
  );
}