"use client";

import { useMemo } from "react";
import useQueryParam from "./useQueryParam";
import { useAppStore } from "@/hooks/useAppStore";

export default function useActivePocket() {
    const { pockets, tasks } = useAppStore();
    const [pocketId] = useQueryParam("pocket");

    const activePocket = useMemo(() => {
        return pockets.find((pocket) => pocket._id === pocketId);
    }, [pocketId, pockets]);

    const remainingTasks = useMemo(() => {
        const completedTasks = tasks.filter((task) => task.isCompleted);
        return tasks.length - completedTasks.length;
    }, [tasks]);

    return { activePocket, remainingTasks };
}