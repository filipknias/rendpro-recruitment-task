"use client";

import PocketLink from "./PocketLink";
import cmdIcon from "../public/cmd-icon.svg"
import shortcutIcon1 from "../public/shortcut-icon1.svg"
import Image from "next/image";
import { Pocket } from "@/types/api";
import { useAppStore } from "@/hooks/useAppStore";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createTask } from "@/server/actions/tasks";
import { useSearchParams } from "next/navigation";

type Props = {
    switchView: () => void;
}

type FormData = {
    description: string;
    isCompleted: boolean;
}

export default function CreateTask({ switchView }: Props) {
    const { pockets } = useAppStore();
    const [selectedPocketId, setSelectedPocketId] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);
    const { register, formState: { errors }, handleSubmit, setValue } = useForm<FormData>();
    const { addTask, addTaskToActivePocket } = useAppStore();
    const searchParams = useSearchParams();
    const pocketId = searchParams.get("pocket");

    const onTaskSubmit = async (values: FormData) => {
        if (!selectedPocketId) return;

        setError(null);
        try {
            const newTask = await createTask(selectedPocketId, { description: values.description, completed: values.isCompleted });

            if (pocketId === newTask.pocket) {
                addTaskToActivePocket(newTask);
            }

            addTask(newTask);
            setValue("description", "");
            setValue("isCompleted", false);
            setSelectedPocketId(null);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    return (
        <div className="p-5">
            <form onSubmit={handleSubmit(onTaskSubmit)}>
                <div className="bg-gray-50 py-2 px-3 flex rounded-lg mb-4">
                    <input 
                        type="checkbox" 
                        {...register("isCompleted")}
                    />
                    <input 
                        type="text" 
                        className="flex-1 text-sm ml-3 bg-transparent focus:outline-none" 
                        placeholder="Create new task"
                        {...register("description", { required: "Task name is required" })}
                    />
                    <button 
                        className="bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-lg py-2 px-3 text-sm text-black font-semibold"
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
                    />
                ))}
            </div>
            <button 
                className="w-full flex justify-between bg-gray-50 rounded-full pr-2 py-2 pl-3 hover:bg-gray-100 transition duration-150 text-black font-medium text-sm"
                onClick={switchView}
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
