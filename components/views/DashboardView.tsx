"use client";

import { Pocket, Task, User } from "@/types/models";
import PocketsSidebar from "../pockets/PocketsSidebar";
import NewTaskPopup from "../tasks/NewTaskPopup";
import { useEffect } from "react";
import { getPocketTasks } from "@/server/actions/tasks";
import useQueryParam from "@/hooks/useQueryParam";
import ActivePocketView from "./ActivePocketView";
import { useAppStore } from "@/hooks/useAppStore";
import MobileSidebar from "../pockets/MobileSidebar";

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


    return (
        <div className="p-4 bg-gray-100 h-screen w-screen flex">
            <div className="w-auto lg:w-1/4">
                {/* <div className="lg:hidden h-full">
                    <MobileSidebar />
                </div>
                <div className="hidden lg:block h-full">
                    <PocketsSidebar />
                </div> */}
                <PocketsSidebar />
            </div>
            <div className="w-auto lg:w-3/4 flex-1">
                <ActivePocketView />
            </div>
            <NewTaskPopup />
        </div>
    )
}
