"use client";

import Link from "next/link";
import { ListTodo, FolderKanban, Clock, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import PinTaskButton from "./PinTaskButton";
import { useEffect, useState } from "react";

const statusColors = {
    PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    IN_PROGRESS: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
    COMPLETED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    CANCELLED: { bg: "bg-zinc-500/10", text: "text-zinc-400", border: "border-zinc-500/20" },
};

const priorityColors = {
    LOW: { bg: "bg-zinc-500/10", text: "text-zinc-400" },
    MEDIUM: { bg: "bg-blue-500/10", text: "text-blue-400" },
    HIGH: { bg: "bg-red-500/10", text: "text-red-400" },
};

const statusIcons = {
    PENDING: Clock,
    IN_PROGRESS: AlertCircle,
    COMPLETED: CheckCircle2,
    CANCELLED: AlertCircle,
};

type Task = {
    id: number;
    title: string;
    description: string | null;
    status: keyof typeof statusColors;
    priority: keyof typeof priorityColors;
    pinned: boolean;
    list: {
        project: {
            id: number;
            name: string;
        };
    };
};

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchTasks() {
            try {
                const res = await fetch("/api/tasks");
                if (res.ok) {
                    const data = await res.json();
                    setTasks(data);
                }
            } catch (error) {
                console.error("Failed to fetch tasks", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTasks();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6 lg:p-10">
            <div className="max-w-[1400px] mx-auto space-y-8">

                {/* HEADER */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">
                            All Tasks
                        </h1>
                        <p className="text-zinc-400 mt-1">
                            View and manage tasks across all your projects
                        </p>
                    </div>
                </header>

                {/* EMPTY STATE */}
                {tasks.length === 0 ? (
                    <div className="bg-zinc-900/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-zinc-700 p-16 text-center">
                        <ListTodo className="w-16 h-16 text-zinc-600 mx-auto mb-6" />
                        <h3 className="text-xl font-semibold text-white mb-2">
                            No tasks yet
                        </h3>
                        <p className="text-zinc-500 mb-6">
                            Create tasks in your projects to see them here.
                        </p>
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 text-white font-semibold hover:text-zinc-300 transition-colors"
                        >
                            Go to Projects <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    /* TASKS LIST */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {tasks.map((task) => {
                            const StatusIcon = statusIcons[task.status] || AlertCircle;
                            const statusColor = statusColors[task.status] || statusColors.PENDING;
                            const priorityColor = priorityColors[task.priority] || priorityColors.LOW;
                            const projectName = task.list?.project?.name || "Unknown Project";
                            const projectId = task.list?.project?.id;

                            return (
                                <div
                                    key={task.id}
                                    className={`group relative bg-zinc-900/60 backdrop-blur-sm rounded-2xl border ${task.pinned ? "border-amber-500/30" : "border-zinc-800/80"
                                        } p-5 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 hover:bg-zinc-900/90 transition-all duration-300`}
                                >
                                    {/* Project Badge - Top Right Corner */}
                                    <div className="absolute top-3 right-3">
                                        <Link
                                            href={`/projects/${projectId}`}
                                            className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-medium rounded-lg border border-indigo-500/20 hover:bg-indigo-500/20 transition-colors"
                                        >
                                            <FolderKanban className="w-3 h-3" />
                                            {projectName}
                                        </Link>
                                    </div>

                                    {/* Task Content */}
                                    <div className="pr-24">
                                        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1">
                                            {task.title}
                                        </h3>
                                        {task.description && (
                                            <p className="text-sm text-zinc-500 mb-4 line-clamp-2">
                                                {task.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status and Priority */}
                                    <div className="flex items-center gap-2 mt-4">
                                        <div className={`flex items-center gap-1.5 px-2.5 py-1 ${statusColor.bg} ${statusColor.text} text-xs font-medium rounded-lg border ${statusColor.border}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {task.status.replace("_", " ")}
                                        </div>
                                        <div className={`px-2.5 py-1 ${priorityColor.bg} ${priorityColor.text} text-xs font-medium rounded-lg`}>
                                            {task.priority}
                                        </div>
                                    </div>

                                    {/* Footer with Pin */}
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800">
                                        <span className="text-[10px] font-bold tracking-widest text-zinc-600">
                                            TASK · {task.id}
                                        </span>
                                        <PinTaskButton taskId={task.id} pinned={task.pinned} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
