"use server";

import { getToken } from "@/lib/session";
import { ApiError, DeletePocketResponse } from "@/types/api";
import { Pocket } from "@/types/models";
import { redirect } from "next/navigation";

export async function getPockets() {
    const token = await getToken();

    if (!token) {
        return redirect("/sign-in");
    }

    const response = await fetch("https://recruitment-task.jakubcloud.pl/pockets", {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
            
    const data = await response.json() as Pocket[]|ApiError;
    
    if ("statusCode" in data) {
        throw new Error(data.message);
    }

    return data;
}

export async function createPocket(newPocket: { name: string, emoji: string }) {
    const token = await getToken();

    if (!token) {
        return redirect("/sign-in");
    }
    
    const response = await fetch("https://recruitment-task.jakubcloud.pl/pockets", {
        method: "POST",
        body: JSON.stringify(newPocket),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });
            
    const data = await response.json() as Pocket|ApiError;

    if ("statusCode" in data) {
        throw new Error(data.message);
    }

    return data;
}

export async function deletePocket(pocketId: string) {
    const token = await getToken();

    if (!token) {
        return redirect("/sign-in");
    }

    const response = await fetch(`https://recruitment-task.jakubcloud.pl/pockets/${pocketId}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    const data = await response.json() as DeletePocketResponse|ApiError;

    if ("statusCode" in data) {
        throw new Error(data.message);
    }

    return data;
}