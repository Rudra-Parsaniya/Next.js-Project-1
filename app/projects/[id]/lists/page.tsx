import { createTaskList, getTaskLists } from "@/app/tasklists/actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TaskListsPage({ params }: Props) {
  const { id } = await params;
  const projectId = Number(id);

  const lists = await getTaskLists(projectId);

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Task Lists</h1>

      <form
        action={createTaskList.bind(null, projectId)}
        className="flex gap-2"
      >
        <input
          name="name"
          placeholder="New list name"
          required
          className="border p-2 flex-1"
        />
        <button className="bg-blue-600 text-white px-3">Add</button>
      </form>

      {lists.map((list: { id: number; name: string }) => (
        <a
          key={list.id}
          href={`/projects/${projectId}/lists/${list.id}/tasks`}
          className="block border p-3 rounded hover:bg-gray-50"
        >
          {list.name}
        </a>
      ))}
    </div>
  );
}
