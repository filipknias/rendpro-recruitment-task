"use server";

import { getToken } from "@/lib/session";
import { ApiError, DeleteTaskResponse, Task } from "@/types/api";
import { redirect } from "next/navigation";

export async function createTask(pocketId: string, newTask: { description: string, completed: boolean }) {
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
        throw new Error(data.message);
    }

    return data;
}

export async function getPocketTasks(pocketId: string) {
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
        throw new Error(data.message);
    }

    return data;
}

export async function updateTask(taskId: string, pocketId: string, updateTask: { description: string, isCompleted: boolean }) {
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
        throw new Error(data.message);
    }

    return data;
}

export async function deleteTask(pocketId: string, taskId: string) {
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
        throw new Error(data.message);
    }

    return data;
}