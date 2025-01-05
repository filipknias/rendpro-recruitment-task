"use client";

import useActivePocket from "@/hooks/useActivePocket";
import useQueryParam from "@/hooks/useQueryParam";
import { useMemo } from "react";
import { notoColorEmoji } from "@/fonts/noto-emoji";
import TaskItem from "../tasks/TaskItem";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deletePocket } from "@/server/actions/pockets";
import { redirect } from "next/navigation";
import { useAppStore } from "@/hooks/useAppStore";

export default function ActivePocketView() {
    const { activePocket, remainingTasks } = useActivePocket();
    const [completed, setCompleted] = useQueryParam("completed");
    const [_, setPocketId] = useQueryParam("pocket");
    const { tasks, pockets, deletePocketFromState } = useAppStore();
    
    const isCompletedStatus = useMemo(() => {
        return completed ? completed.toLowerCase() === "true" : false;
    }, [completed]);

    const visibleTasks = useMemo(() => {
        return tasks.filter((task) => task.isCompleted === isCompletedStatus);
    }, [tasks, isCompletedStatus]);

    const { mutate } = useMutation({
        mutationFn: deletePocket,
        onSuccess: () => {
            if (!activePocket) return;
            deletePocketFromState(activePocket._id);
            toast.success("Pocket deleted successfully");
            if (pockets.length > 0) {
                setPocketId(pockets[0]._id);
            } else {
                redirect("/");
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handlePocketDelete = async () => {
        if (!activePocket) return;
        mutate(activePocket._id);
    };

    return (
        <div className="px-4 lg:px-10 py-10">
            {activePocket && (
                <div className="flex flex-wrap justify-between items-end gap-4 mb-12">
                    <div>
                        <h2 className="font-semibold text-2xl mb-2">
                            <span className={`${notoColorEmoji.className}`}>
                                {activePocket.emoji}
                            </span>
                            <span className="ml-1">{activePocket.name}</span>
                        </h2>
                        <p className="text-sm text-gray-600">
                            Remaining {remainingTasks} from {activePocket.tasks.length} tasks.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3 w-full lg:w-auto">
                        <button 
                            className="w-full lg:w-auto bg-white hover:bg-indigo-100 transition duration-150 py-2 px-3 rounded-lg font-semibold text-sm text-gray-900 hover:text-indigo-500"
                            onClick={() => setCompleted((!isCompletedStatus).toString())}
                        >
                            {isCompletedStatus ? "Hide completed" : "Show completed"}
                        </button>
                        <button 
                            className="w-full lg:w-auto bg-white hover:bg-gray-50 transition duration-150 py-2 px-3 rounded-lg font-semibold text-sm text-red-500"
                            onClick={handlePocketDelete}
                        >
                            Delete pocket
                        </button>
                    </div>
                </div>
            )}
            <div className="flex flex-col gap-2">
                {visibleTasks.map((task) => (
                    <TaskItem
                        key={task._id}
                        description={task.description}
                        isCompleted={task.isCompleted}
                        id={task._id}
                    />
                ))}
                {visibleTasks.length === 0 && (
                    <p className="text-gray-500 text-center mb-2">No tasks found</p>
                )}
            </div>
        </div>
    )
}
