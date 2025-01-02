"use server";

import { cookies } from "next/headers";

export async function createSession(name: string, value: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const cookieStore = await cookies();
    
    cookieStore.set(name, value, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    });
}

export async function deleteSession(name: string) {
    const cookieStore = await cookies();
    cookieStore.delete(name);
}

export async function getToken() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    return token ? token.value : null;
}