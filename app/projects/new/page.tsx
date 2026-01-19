import { createProject } from "../actions";
import { redirect } from "next/navigation";

export default function NewProjectPage() {
  async function handleCreate(formData: FormData) {
    "use server";
    await createProject(formData);
    redirect("/projects");
  }

  return (
    <div className="p-6 max-w-md">
      <h1 className="text-xl font-bold mb-4">Create Project</h1>

      <form action={handleCreate} className="space-y-4">
        <input
          name="name"
          placeholder="Project name"
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          placeholder="Description (optional)"
          className="w-full border p-2 rounded"
        />

        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Create
        </button>
      </form>
    </div>
  );
}
