"use client";

import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  projectId: number;
};

export default function DeleteProjectButton({ projectId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/projects");
        router.refresh(); // Refresh to update list
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-4 py-2 rounded-xl font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isDeleting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Trash2 className="w-4 h-4" />
      )}
      {isDeleting ? "Deleting..." : "Delete Project"}
    </button>
  );
}