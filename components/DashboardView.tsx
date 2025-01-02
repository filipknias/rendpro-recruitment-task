"use client";

import { Pocket, Task, User } from "@/types/api";
import PocketsSidebar from "./PocketsSidebar";
import { notoColorEmoji } from "@/app/layout";
import TaskItem from "./TaskItem";
import NewTaskPopup from "./NewTaskPopup";
import { useCallback, useEffect, useMemo } from "react";
import { useAppStore } from "@/hooks/useAppStore";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { getPocketTasks } from "@/server/actions/tasks";

type Props = {
    initialData: {
        user: User;
        pockets: Pocket[];
        tasks: Task[];
    }
}

export default function DashboardView({ initialData }: Props) {
    const { setInitialData, setPocketTasks, tasks, pockets } = useAppStore();
    const searchParams = useSearchParams();
    const pocketId = searchParams.get("pocket");
    const completedTasks = searchParams.get("completed");
    const activePocket = pockets.find((pocket) => pocket._id === pocketId);
    const router = useRouter();
    const pathname = usePathname();
    
    const completedTasksBoolean = useMemo(() => {
        return completedTasks ? completedTasks.toLowerCase() === "true" : false;
    }, [completedTasks]);

    const displayTasks = useMemo(() => {
        return tasks.filter((task) => task.isCompleted === completedTasksBoolean);
    }, [tasks, completedTasksBoolean]);

    const fetchAndSetPocketTasks = async () => {
        if (!pocketId) return;
        const tasks = await getPocketTasks(pocketId);
        setPocketTasks(tasks);
    };

    useEffect(() => {
        setInitialData(initialData);
    }, [initialData]);

    useEffect(() => {
        fetchAndSetPocketTasks();
    }, [pocketId]);

    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value);
    
        return params.toString();
    }, [searchParams]);

    const handlePocketDelete = async () => {

    };

    return (
        <div className="p-4 bg-gray-100 h-screen w-screen flex">
            <div className="w-auto lg:w-1/4">
                <PocketsSidebar />
            </div>
            <div className="w-auto lg:w-3/4 flex-1">
                <div className="px-4 lg:px-10 py-10">
                    <div className="flex flex-wrap justify-between items-end gap-4 mb-12">
                        {activePocket && (
                            <div>
                                <h2 className="font-semibold text-2xl mb-2">
                                    <span className={`${notoColorEmoji.className}`}>
                                        {activePocket.emoji}
                                    </span>
                                    <span className="ml-1">{activePocket.name}</span>
                                </h2>
                                <p className="text-sm text-gray-600">
                                    Remaining 2 from {activePocket.tasks.length} tasks.
                                </p>
                            </div>
                        )}
                        <div className="flex flex-wrap gap-3">
                            <button 
                                className="w-full lg:w-auto bg-white hover:bg-gray-50 transition duration-150 py-2 px-3 rounded-lg font-semibold text-sm text-gray-900"
                                onClick={() => router.push(pathname + '?' + createQueryString('completed', (!completedTasksBoolean).toString()))}
                            >
                                {completedTasksBoolean ? "Hide completed" : "Show completed"}
                            </button>
                            <button 
                                className="w-full lg:w-auto bg-white hover:bg-gray-50 transition duration-150 py-2 px-3 rounded-lg font-semibold text-sm text-red-500"
                                onClick={handlePocketDelete}
                            >
                                Delete pocket
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {displayTasks.map((task) => (
                            <TaskItem
                                key={task._id}
                                description={task.description}
                                isCompleted={task.isCompleted}
                                id={task._id}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <NewTaskPopup />
        </div>
    )
}
