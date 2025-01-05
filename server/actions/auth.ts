"use server";

import { createSession, deleteSession, getToken } from "@/lib/session";
import { ApiError, AuthResponse } from "@/types/api";
import { User } from "@/types/models";
import { redirect } from "next/navigation";

type UserCredentials = {
    login: string;
    password: string;
}

type AdditionalUserCredentials = {
    firstName: string;
    lastName: string;
    avatar: File;
}

export async function registerUser(credentials: UserCredentials) {
    const response = await fetch("https://recruitment-task.jakubcloud.pl/auth/register", {
        method: "POST",
        body: JSON.stringify(credentials),
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await response.json() as AuthResponse|ApiError;
    
    if ("error" in data) {
        throw new Error(data.message);
    }

    if ("token" in data) {
        await createSession("token", data.token);
    }
}

export async function loginUser(credentials: UserCredentials) {
    try {
        const response = await fetch("https://recruitment-task.jakubcloud.pl/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: {
                "Content-Type": "application/json"
            }
        });
                
        const data = await response.json() as AuthResponse|ApiError;
    
        if ("token" in data) {
            await createSession("token", data.token);
        }
    
        redirect("/");
    } catch (error) {
        if (error instanceof Error) {
            return { message: error.message }
        }
    }
}

export async function completeUserProfile(completeCredentials: AdditionalUserCredentials) {
    const token = await getToken();

    if (!token) {
        return redirect("/sign-in");
    }

    const formData = new FormData();
    formData.append('file', completeCredentials.avatar);
    
    const avatarRequest = await fetch('https://recruitment-task.jakubcloud.pl/users/avatar', {
        method: 'PUT',
        body: formData,
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
    const updateRequest = await fetch('https://recruitment-task.jakubcloud.pl/users/update', {
        method: 'PUT',
        body: JSON.stringify({
            firstName: completeCredentials.firstName,
            lastName: completeCredentials.lastName,
        }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
    });

    await Promise.all([avatarRequest, updateRequest]);

    redirect("/");
}

export async function getUserInfo() {
    const token = await getToken();

    if (!token) {
        return redirect("/sign-in");
    }

    const response = await fetch("https://recruitment-task.jakubcloud.pl/users/me", {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });

    const data = await response.json() as User|ApiError;

    if ("error" in data) {
        throw new Error(data.message);
    }

    return data;
}

export async function logoutUser() {
    const token = await getToken();

    if (!token) {
        return redirect("/sign-in");
    }

    const response = await fetch("https://recruitment-task.jakubcloud.pl/auth/logout", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    });
            
    const data = await response.json() as AuthResponse|ApiError;

    if ("error" in data) {
        throw new Error(data.message);
    }

    deleteSession("token");

    redirect("/sign-in");
}