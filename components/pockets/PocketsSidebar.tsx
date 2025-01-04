"use client";

import Image from "next/image";
import PocketLink from "./PocketLink";
import cmdIcon from "@/public/cmd-icon.svg"
import shortcutIcon1 from "@/public/shortcut-icon1.svg"
import { logoutUser } from "@/server/actions/auth";
import useQueryParam from "@/hooks/useQueryParam";
import { useAppStore } from "@/hooks/useAppStore";

export default function PocketsSidebar() {
    const { pockets, user, openTaskPopup } = useAppStore();
    const [pocketId, setPocketId] = useQueryParam("pocket");

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
                            onClick={() => setPocketId(_id)}
                            isResponsive
                        />
                    ))}
                    {pockets.length === 0 && (
                        <p className="text-gray-500 text-center mb-2">No pockets found</p>
                    )}
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
                    <div className="flex items-center gap-2">
                        {user && (
                            <Image 
                                width={36}
                                height={36}
                                className="w-9 h-9 object-cover"
                                src={user.avatar}
                                alt={user.login}
                            />
                        )}
                        <div className="hidden lg:block">
                            {user && <p className="font-medium text-sm text-black">{user.firstName} {user.lastName}</p>}
                            <p 
                                className="inline-block text-gray-600 hover:underline font-medium text-xs cursor-pointer"
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
