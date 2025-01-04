"use client";

import Image from "next/image";
import useQueryParam from "@/hooks/useQueryParam";
import { useAppStore } from "@/hooks/useAppStore";
import expandIcon from '@/public/expand-icon.svg';
import { notoColorEmoji } from "@/app/layout";
import { useState } from "react";
import { motion } from 'motion/react';
import cmdIcon from "@/public/cmd-icon.svg"
import shortcutIcon1 from "@/public/shortcut-icon1.svg"
import PocketsSidebar from "./PocketsSidebar";

export default function MobileSidebar() {
    const { pockets, user, openTaskPopup, tasks, logoutUser } = useAppStore();
    const [pocketId, setPocketId] = useQueryParam("pocket");
    const [navExpanded, setNavExpanded] = useState(false);

    return (
        <>
            {/* {navExpanded && (
                <div className="fixed top-4 left-4">
                    <PocketsSidebar />
                </div>
            )} */}
            <motion.div layout className={`rounded-xl bg-white px-2 lg:px-6 py-10 h-full ${navExpanded ? "fixed" : ""}`}>
                <div className="flex flex-col h-full">
                    <button 
                        className="p-2 bg-gray-100 hover:bg-gray-200 transition duration-150 rounded-md flex items-center justify-center mb-8"
                        onClick={() => setNavExpanded(!navExpanded)}
                    >
                        <Image src={expandIcon} alt="expand-icon" />
                    </button>
                    <div className="flex flex-col gap-2">
                        {pockets.map(({ emoji, _id, name }) => (
                            <button 
                                className={`rounded-md p-2 flex justify-between transition duration-150 group ${pocketId === _id ? "bg-indigo-600" : "bg-white hover:bg-gray-50"}`}
                                onClick={() => setPocketId(_id)}
                                key={_id}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={`${notoColorEmoji.className}`}>{emoji}</span>
                                    {navExpanded && <motion.p layout className={`font-medium text-sm ${pocketId === _id ? "text-white" : "text-black"}`}>{name}</motion.p>}
                                </div>
                                {navExpanded && (
                                    <motion.div layout className={`w-6 h-6 rounded-md flex items-center justify-center text-sm ${pocketId === _id ? "bg-indigo-500 text-white" : "bg-gray-50 text-gray-700"}`}>
                                        {tasks.length}
                                    </motion.div>
                                )}
                            </button>
                        ))}
                        <button 
                            className="flex justify-between bg-gray-50 rounded-full pr-2 py-2 pl-3 hover:bg-gray-100 transition duration-150 text-black font-medium text-sm"
                            onClick={() => openTaskPopup("pocket")}
                        >
                            <div className="flex items-center gap-4">
                                <span>+</span>
                                {navExpanded && <p>Create new pocket</p>}
                            </div>
                            {navExpanded && (
                                <div className="flex items-center gap-2">
                                    <Image src={cmdIcon} alt="cmd-icon" />
                                    <Image src={shortcutIcon1} alt="shortcut-icon" />
                                </div>
                            )}
                        </button>
                    </div>
                    <div className="mt-auto">
                        {user && (
                            <Image 
                                width={36}
                                height={36}
                                className="w-9 h-9 object-cover"
                                src={user.avatar}
                                alt={user.login}
                            />
                        )}
                        {navExpanded && (
                            <div>
                                {user && <p className="mb-1 font-medium text-sm text-black">{user.firstName} {user.lastName}</p>}
                                <p 
                                    className="text-gray-600 hover:text-gray-800 transition duration-150 font-medium text-xs cursor-pointer"
                                    onClick={logoutUser}
                                >
                                    Log out
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </>
    )
}
