import {
  createTask,
  getTasks,
  deleteTask,
  updateTaskStatus,
  updateTask,
} from "@/app/tasks/actions";
import { TaskStatus } from "@prisma/client";

type Props = {
  params: Promise<{ id: string; listId: string }>;
};

export default async function TasksPage({ params }: Props) {
  const { listId } = await params;
  const listID = Number(listId);

  const tasks = await getTasks(listID);

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-bold">Tasks</h1>

      {/* CREATE TASK */}
      <form action={createTask.bind(null, listID)} className="space-y-2">
        <input
          name="title"
          placeholder="Task title"
          required
          className="border p-2 w-full"
        />
        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 w-full"
        />
        <button className="bg-green-600 text-white px-4 py-2">
          Add Task
        </button>
      </form>

      {/* TASK LIST */}
      {tasks.map((task) => (
  <div
    key={task.id}
    className="border p-3 rounded space-y-2"
  >
    {/* EDIT TASK */}
    <form
      action={updateTask.bind(null, task.id)}
      className="space-y-2"
    >
      <input
        name="title"
        defaultValue={task.title}
        className="border p-1 w-full"
        required
      />

      <textarea
        name="description"
        defaultValue={task.description ?? ""}
        className="border p-1 w-full"
      />

      <div className="flex gap-2">
        <button className="bg-yellow-600 text-white px-2 py-1 text-sm">
          Update
        </button>
      </div>
    </form>

    {/* STATUS + DELETE */}
    <div className="flex gap-2">
      <form
        action={updateTaskStatus.bind(
          null,
          task.id,
          task.status === "COMPLETED"
            ? "PENDING"
            : "COMPLETED"
        )}
      >
        <button className="bg-blue-600 text-white px-2 py-1 text-sm">
          {task.status === "COMPLETED"
            ? "Mark Pending"
            : "Mark Complete"}
        </button>
      </form>

      <form action={deleteTask.bind(null, task.id)}>
        <button className="bg-red-600 text-white px-2 py-1 text-sm">
          Delete
        </button>
      </form>
    </div>

    <div className="text-xs text-gray-500">
      Status: {task.status}
    </div>
  </div>
))}

    </div>
  );
}
