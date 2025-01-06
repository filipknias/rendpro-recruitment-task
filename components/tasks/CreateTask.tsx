"use client";

import PocketLink from "../pockets/PocketLink";
import cmdIcon from "@/public/cmd-icon.svg"
import shortcutIcon1 from "@/public/shortcut-icon1.svg"
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createTask } from "@/server/actions/tasks";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import useQueryParam from "@/hooks/useQueryParam";
import { useAppStore } from "@/hooks/useAppStore";

type FormData = {
    description: string;
    isCompleted: boolean;
}

export default function CreateTask() {
    const [selectedPocketId, setSelectedPocketId] = useState<string|null>(null);
    const { register, handleSubmit, setValue } = useForm<FormData>();
    const { addTask, addTaskToActivePocket, closeTaskPopup, pockets, switchTaskPopupView } = useAppStore();
    const [pocketId] = useQueryParam("pocket");

    const { mutate, isPending } = useMutation({
        mutationFn: createTask,
        onSuccess: (taskData) => {
            if (!taskData?.success && taskData?.message) {
                toast.error(taskData.message);
            }
            if (taskData?.task) {
                if (pocketId === taskData.task.pocket) {
                    addTaskToActivePocket(taskData.task);
                }
                addTask(taskData.task);
                setValue("description", "");
                setValue("isCompleted", false);
                setSelectedPocketId(null);
                toast.success("Task successfully created");
                closeTaskPopup();
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const onTaskSubmit = async (taskData: FormData) => {
        if (!selectedPocketId) return;
        mutate({ 
            pocketId: selectedPocketId, 
            newTask: taskData 
        });
    };

    return (
        <div className="p-5 flex flex-col h-full">
            <form onSubmit={handleSubmit(onTaskSubmit)}>
                <div className="bg-gray-50 py-2 px-3 flex items-center rounded-lg mb-4">
                    <div className="relative">
                        <input 
                            className="custom-checkbox-white opacity-0 absolute z-10 w-6 h-6 top-0 left-0" 
                            type="checkbox"
                            {...register("isCompleted")}
                        />
                        <div className="border border-gray-200 bg-white w-6 h-6 flex justify-center items-center rounded-md">
                            <svg className="hidden" width="10" height="7" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.76764 0.22597C9.45824 -0.0754185 8.95582 -0.0752285 8.64601 0.22597L3.59787 5.13702L1.35419 2.95437C1.04438 2.65298 0.542174 2.65298 0.23236 2.95437C-0.0774534 3.25576 -0.0774534 3.74431 0.23236 4.0457L3.03684 6.77391C3.19165 6.92451 3.39464 7 3.59765 7C3.80067 7 4.00386 6.9247 4.15867 6.77391L9.76764 1.31727C10.0775 1.01609 10.0775 0.52734 9.76764 0.22597Z" fill="currentColor"></path>
                            </svg>
                        </div>
                    </div>
                    <input 
                        type="text" 
                        className="flex-1 text-sm ml-3 bg-transparent focus:outline-none" 
                        placeholder="Create new task"
                        required
                        {...register("description", { required: "Task name is required" })}
                    />
                    <button 
                        className="bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-lg py-2 px-3 text-sm text-black font-semibold disabled:bg-gray-100"
                        disabled={isPending}
                    >
                        Create
                    </button>
                </div>    
            </form>
            <p className="text-sm font-medium text-black mb-2">Select pocket</p>
            <div className="flex flex-col gap-2 mb-4">
                {pockets.map(({ emoji, name, tasks, _id }) => (
                    <PocketLink
                        key={_id}
                        emoji={emoji}
                        name={name}
                        tasksCount={tasks.length}
                        isActive={selectedPocketId === _id}
                        onClick={() => setSelectedPocketId(_id)}
                        isResponsive={false}
                    />
                ))}
                {pockets.length === 0 && (
                    <p className="text-gray-500 text-center mt-2 text-sm">No pockets found</p>
                )}
            </div>
            <button 
                className="w-full mt-auto flex justify-between bg-gray-50 rounded-full pr-2 py-2 pl-3 hover:bg-gray-100 transition duration-150 text-black font-medium text-sm"
                onClick={() => switchTaskPopupView("pocket")}
            >
                <div className="flex items-center gap-4">
                    <span>+</span>
                    <p>Create new pocket</p>
                </div>
                <div className="flex items-center gap-2">
                    <Image src={cmdIcon} alt="cmd-icon" />
                    <Image src={shortcutIcon1} alt="shortcut-icon" />
                </div>
            </button>
        </div>
    )
}
