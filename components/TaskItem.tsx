"use client";

import { useAppStore } from "@/hooks/useAppStore";
import { deleteTask, updateTask } from "@/server/actions/tasks";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import trashIcon from '../public/trash-icon.svg';
import Image from "next/image";

type Props = {
    description: string;
    isCompleted: boolean;
    id: string;
}

export default function TaskItem({ description, isCompleted, id }: Props) {
    const { register, formState: { errors }, watch } = useForm<{ completed: boolean }>({
        defaultValues: {
            completed: isCompleted,
        }
    });
    const { updateTaskCompletedState, pockets, deleteTaskFromState } = useAppStore();
    const [updateTaskError, setUpdateTaskError] = useState<string|null>(null);
    const [deleteTaskError, setDeleteTaskError] = useState<string|null>(null);
    const searchParams = useSearchParams();
    const pocketId = searchParams.get("pocket");
    const activePocket = pockets.find((pocket) => pocket._id === pocketId);
    const [popupOpened, setPopupOpened] = useState(false);

    const syncTaskCompletionWithState = async (completed: boolean) => {
        if (!activePocket) return;

        setUpdateTaskError(null);
        try {
            const updatedTask = await updateTask(id, activePocket._id, { description, isCompleted: completed });
            updateTaskCompletedState(updatedTask._id, updatedTask.isCompleted);
        } catch (error) {
            if (error instanceof Error) {
                setUpdateTaskError(error.message);
            }
        }
    };

    const completedState = watch("completed");

    useEffect(() => {
        syncTaskCompletionWithState(completedState);
    }, [completedState]);

    const handleTaskDelete = async () => {
        if (!activePocket) return;

        setDeleteTaskError(null);
        try {
            await deleteTask(activePocket._id, id);
            deleteTaskFromState(id);
            setPopupOpened(false);
        } catch (error) {
            if (error instanceof Error) {
                setDeleteTaskError(error.message);
            }
        }
    };

    return (
        <div className={`py-1 pr-1 pl-2 rounded-md flex justify-between ${isCompleted ? "bg-indigo-600" : "bg-white"}`}>
            <div className="flex items-center gap-2">
                <input type="checkbox" {...register("completed")} />
                <p className={`text-sm ${isCompleted ? "text-white line-through" : "text-black"}`}>{description}</p>
            </div>
            <div className="relative">
                <button 
                    className={`
                        w-8 h-8 rounded-md flex items-center justify-center transition duration-150 
                        ${isCompleted ? "bg-indigo-500 hover:bg-indigo-400 text-white" : "bg-gray-50 hover:bg-gray-100 text-black"}
                    `}
                    onClick={() => setPopupOpened(!popupOpened)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="5" r="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <circle cx="12" cy="19" r="2"/>
                    </svg>
                </button>
                <AnimatePresence initial={false}>
                    {popupOpened && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="absolute -bottom-10 -left-16 z-10"
                        >
                            <button 
                                className="bg-white rounded-md px-6 py-2 flex items-center justify-center gap-2 text-sm text-red-500 shadow-sm hover:bg-gray-50 transition duration-200"
                                onClick={handleTaskDelete}
                            >
                                <Image src={trashIcon} alt="trash-icon" />
                                <span>Delete</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
