"use client";

import Image from "next/image";
import PocketLink from "./PocketLink";
import cmdIcon from "../public/cmd-icon.svg"
import shortcutIcon1 from "../public/shortcut-icon1.svg"
import { logoutUser } from "@/server/actions/auth";
import { useAppStore } from "@/hooks/useAppStore";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";

export default function PocketsSidebar() {
    const { pockets, user, openTaskPopup } = useAppStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const pocketId = searchParams.get("pocket");

    const createQueryString = useCallback((name: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(name, value);
    
        return params.toString();
    }, [searchParams]);

    return (
        <div className="rounded-xl bg-white px-2 lg:px-6 py-10 h-full">
            <div className="flex flex-col h-full">
                <h2 className="hidden lg:block text-black font-semibold text-2xl mb-8">Pockets</h2>
                <div className="flex flex-col gap-2">
                    {pockets.map(({ emoji, name, tasks, _id }) => (
                        <PocketLink
                            key={_id}
                            emoji={emoji}
                            name={name}
                            tasksCount={tasks.length}
                            isActive={pocketId === _id}
                            onClick={() => router.push(pathname + '?' + createQueryString('pocket', _id))}
                        />
                    ))}
                    <button 
                        className="flex justify-between bg-gray-50 rounded-full pr-2 py-2 pl-3 hover:bg-gray-100 transition duration-150 text-black font-medium text-sm"
                        onClick={() => openTaskPopup("pocket")}
                    >
                        <div className="flex items-center gap-4">
                            <span>+</span>
                            <p className="hidden lg:block">Create new pocket</p>
                        </div>
                        <div className="hidden lg:flex items-center gap-2">
                            <Image src={cmdIcon} alt="cmd-icon" />
                            <Image src={shortcutIcon1} alt="shortcut-icon" />
                        </div>
                    </button>
                </div>
                <div className="mt-auto">
                    <div className="flex gap-2">
                        {user && (
                            <Image 
                                width={36}
                                height={36}
                                className="w-9 h-9 object-cover"
                                src={user.avatar}
                                alt="alt" 
                            />
                        )}
                        <div className="hidden lg:block">
                            {user && <p className="mb-1 font-medium text-sm text-black">{user.firstName} {user.lastName}</p>}
                            <p 
                                className="text-gray-600 hover:text-gray-800 transition duration-150 font-medium text-xs cursor-pointer"
                                onClick={logoutUser}
                            >
                                Log out
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
