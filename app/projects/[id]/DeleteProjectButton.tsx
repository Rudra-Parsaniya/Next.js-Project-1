"use client";

import { deleteProject } from "./actions";

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
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Delete Project
      </button>
    </form>
  );
}