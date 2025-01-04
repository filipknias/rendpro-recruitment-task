"use client";

import { deleteTask, updateTask } from "@/server/actions/tasks";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import trashIcon from '@/public/trash-icon.svg';
import Image from "next/image";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useActivePocket from "@/hooks/useActivePocket";
import { useAppStore } from "@/hooks/useAppStore";

type Props = {
    description: string;
    isCompleted: boolean;
    id: string;
}

export default function TaskItem({ description, isCompleted, id }: Props) {
    const { register, watch } = useForm<{ completed: boolean }>({
        defaultValues: {
            completed: isCompleted,
        }
    });
    const { updateTaskCompletedState, deleteTaskFromState } = useAppStore();
    const { activePocket } = useActivePocket();
    const [popupOpened, setPopupOpened] = useState(false);

    const updateTaskMutation = useMutation({
        mutationFn: updateTask,
        onSuccess: (updatedTask) => {
            updateTaskCompletedState(updatedTask._id, updatedTask.isCompleted);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const deleteTaskMutation = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => {
            deleteTaskFromState(id);
            setPopupOpened(false);
            toast.success("Task deleted successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const syncTaskCompletionWithState = async (isCompleted: boolean) => {
        if (!activePocket) return;
        updateTaskMutation.mutate({ 
            taskId: id, 
            pocketId: activePocket._id, 
            updateTask: { description, isCompleted },
        });
    };

    const completedState = watch("completed");

    useEffect(() => {
        syncTaskCompletionWithState(completedState);
    }, [completedState]);

    const handleTaskDelete = async () => {
        if (!activePocket) return;
        deleteTaskMutation.mutate({ 
            pocketId: activePocket._id, 
            taskId: id,
        });
    };

    return (
        <div className={`py-1 pr-1 pl-2 rounded-md flex justify-between transition duration-150 ${isCompleted ? "bg-indigo-600" : "bg-white"}`}>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <input 
                        className={`${isCompleted ? "custom-checkbox-indigo" : "custom-checkbox-white"} opacity-0 absolute z-10 w-6 h-6 top-0 left-0`} 
                        type="checkbox"
                        {...register("completed")}
                    />
                    <div className="border border-gray-200 bg-white w-6 h-6 flex justify-center items-center rounded-md">
                        <svg className="hidden" width="10" height="7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.76764 0.22597C9.45824 -0.0754185 8.95582 -0.0752285 8.64601 0.22597L3.59787 5.13702L1.35419 2.95437C1.04438 2.65298 0.542174 2.65298 0.23236 2.95437C-0.0774534 3.25576 -0.0774534 3.74431 0.23236 4.0457L3.03684 6.77391C3.19165 6.92451 3.39464 7 3.59765 7C3.80067 7 4.00386 6.9247 4.15867 6.77391L9.76764 1.31727C10.0775 1.01609 10.0775 0.52734 9.76764 0.22597Z" fill="currentColor"></path>
                        </svg>
                    </div>
                </div>
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
