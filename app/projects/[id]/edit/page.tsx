import { getProjectById, updateProject } from "../actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const projectId = Number(id);

  if (!id || Number.isNaN(projectId)) {
    return <div className="p-6 text-red-500">Invalid project ID</div>;
  }

  const project = await getProjectById(projectId);

  return (
    <div className="p-6 max-w-xl space-y-6">
      <h1 className="text-2xl font-bold">Edit Project</h1>

      <form action={updateProject} className="space-y-4">
        <input type="hidden" name="projectId" value={project.id} />

        <div>
          <label className="block text-sm font-medium mb-1">
            Project Name
          </label>
          <input
            name="name"
            defaultValue={project.name}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            name="description"
            defaultValue={project.description ?? ""}
            className="w-full border p-2 rounded"
            rows={4}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Project
        </button>
      </form>
    </div>
  );
}
