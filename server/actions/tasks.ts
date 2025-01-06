"use server";

import { getToken } from "@/lib/session";
import { ApiError, DeleteTaskResponse } from "@/types/api";
import { Task } from "@/types/models";
import { redirect } from "next/navigation";

type AppTask = {
    description: string;
    isCompleted: boolean;
}

export async function createTask({ pocketId, newTask }: { pocketId: string, newTask: AppTask}) {
    try {
        const token = await getToken();

        if (!token) {
            return redirect("/sign-in");
        }
    
        const response = await fetch(`https://recruitment-task.jakubcloud.pl/pockets/${pocketId}/tasks`, {
            method: "POST",
            body: JSON.stringify(newTask),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
    
        const data = await response.json() as Task|ApiError;
    
        if ("error" in data) {
            return { success: false, message: data.message };
        }
    
        return { success: true, task: data };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}

export async function getPocketTasks(pocketId: string) {
    try {
        const token = await getToken();

        if (!token) {
            return redirect("/sign-in");
        }
    
        const response = await fetch(`https://recruitment-task.jakubcloud.pl/pockets/${pocketId}/tasks`, {
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
                
        const data = await response.json() as Task[]|ApiError;
    
        if ("error" in data) {
            return { success: false, message: data.message };
        }
    
        return { success: true, tasks: data };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}

export async function updateTask({ taskId, pocketId, updateTask }: { taskId: string, pocketId: string, updateTask: AppTask }) {
    try {
        const token = await getToken();

        if (!token) {
            return redirect("/sign-in");
        }
    
        const response = await fetch(`https://recruitment-task.jakubcloud.pl/pockets/${pocketId}/tasks/${taskId}`, {
            method: "PUT",
            body: JSON.stringify(updateTask),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
                
        const data = await response.json() as Task|ApiError;
    
        if ("error" in data) {
            return { success: false, message: data.message };
        }
    
        return { success: true, task: data };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}

export async function deleteTask({ pocketId, taskId }: { pocketId: string, taskId: string }) {
    try {
        const token = await getToken();
    
        if (!token) {
            return redirect("/sign-in");
        }
    
        const response = await fetch(`https://recruitment-task.jakubcloud.pl/pockets/${pocketId}/tasks/${taskId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
            }
        });
                
        const data = await response.json() as DeleteTaskResponse|ApiError;
    
        if ("error" in data) {
            return { success: false, message: data.message };
        }
    
        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}