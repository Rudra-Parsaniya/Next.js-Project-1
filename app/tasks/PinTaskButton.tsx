"use client";

import { Pin, PinOff } from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function PinTaskButton({
    taskId,
    pinned,
}: {
    taskId: number;
    pinned: boolean;
}) {
    const [isPending, startTransition] = useTransition();

    const handleToggle = async () => {
        // Optimistic update (optional, but good for UI)
        startTransition(async () => {
            try {
                await fetch(`/api/tasks/${taskId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ pinned: !pinned }),
                });

                // Revalidate/Refresh
                window.location.reload();
            } catch (error) {
                console.error("Failed to pin task", error);
            }
        });
    };

    return (
        <button
            onClick={handleToggle}
            disabled={isPending}
            className={`p-2 rounded-lg transition-all duration-200 ${pinned
                ? "text-amber-400 bg-amber-500/10 hover:bg-amber-500/20"
                : "text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10"
                } disabled:opacity-50`}
            title={pinned ? "Unpin task" : "Pin task"}
        >
            {pinned ? (
                <Pin className="w-4 h-4 fill-current" />
            ) : (
                <Pin className="w-4 h-4" />
            )}
        </button>
    );
}
