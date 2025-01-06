"use client";

import { Pocket, Task, User } from "@/types/models";
import PocketsSidebar from "../pockets/PocketsSidebar";
import NewTaskPopup from "../tasks/NewTaskPopup";
import { useEffect } from "react";
import { getPocketTasks } from "@/server/actions/tasks";
import useQueryParam from "@/hooks/useQueryParam";
import ActivePocketView from "./ActivePocketView";
import { useAppStore } from "@/hooks/useAppStore";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

type Props = {
    initialData: {
        user: User;
        pockets: Pocket[];
        tasks: Task[];
    }
}

export default function DashboardView({ initialData }: Props) {
    const { setInitialData, setPocketTasks } = useAppStore();
    const [pocketId] = useQueryParam("pocket");

    const { data, error } = useQuery({
        queryKey: ['update-task', pocketId],
        queryFn: () => getPocketTasks(pocketId!),
        enabled: pocketId !== null,
    });

    useEffect(() => {
        if (error) {
            toast.error(error.message);
        }
      }, [error]);

    useEffect(() => {
        if (!data?.success && data?.message) {
            toast.error(data.message);
        }
        if (data?.tasks) {
            setPocketTasks(data.tasks);
        }
    }, [data]);

    useEffect(() => {
        setInitialData(initialData);
    }, [initialData]);

    return (
        <div className="p-4 bg-gray-100 h-screen w-screen flex">
            <div className="w-auto lg:w-1/4">
                <PocketsSidebar />
            </div>
            <div className="w-auto lg:w-3/4 flex-1">
                <ActivePocketView />
            </div>
            <NewTaskPopup />
        </div>
    )
}
