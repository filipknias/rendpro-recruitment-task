"use server";

import { getToken } from "@/lib/session";
import { ApiError, DeletePocketResponse } from "@/types/api";
import { Pocket } from "@/types/models";
import { redirect } from "next/navigation";

export async function getPockets() {
    try {
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
        
        if ("error" in data) {
            return { success: false, message: data.message };
        }
    
        return { success: true, pockets: data };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}

export async function createPocket(newPocket: { name: string, emoji: string }) {
    try {
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
    
        if ("error" in data) {
            return { success: false, message: data.message };
        }
    
        return { success: true, pocket: data };
    } catch (error) {
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
            };
        }
    }
}

export async function deletePocket(pocketId: string) {
    try {
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