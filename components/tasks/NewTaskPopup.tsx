"use client";

import Image from "next/image";
import arrowUpIcon from "@/public/arrow-up.svg";
import cmdIconDark from "@/public/cmd-icon-dark.svg";
import shortcutIconDark from "@/public/shortcut-icon-dark.svg";
import cmdIconPurple from "@/public/cmd-icon-purple.svg";
import shortcutIconPurple from "@/public/shortcut-icon-purple.svg";
import { AnimatePresence, motion, useAnimation } from "motion/react";
import { useEffect, useState } from "react";
import CreateTask from "./CreateTask";
import CreatePocket from "../pockets/CreatePocket";
import { useAppStore } from "@/hooks/useAppStore";

export default function NewTaskPopup() {
    const { taskPopup, toggleTaskPopup } = useAppStore();
    const controls = useAnimation();
    const [pocketView, setPocketView] = useState(false);
    const transition = { duration: 0.5, ease: 'easeInOut' };

    useEffect(() => {
        if (pocketView) {
            controls.start({
                x: '-100%',
                transition,
            });
        } else {
            controls.start({
                x: '0',
                transition,
            });
        }
    }, [pocketView]);

    useEffect(() => {
        if (taskPopup.view === "pocket") {
            setPocketView(true);
        } else {
            setPocketView(false);
        }
    }, [taskPopup.view]);

    return (
        <div className="fixed bottom-4 left-0 w-full px-4">
            <div className="w-full max-w-lg mx-auto">
                <AnimatePresence initial={false}>
                    {taskPopup.open && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className="w-full bg-white mb-3 rounded-2xl overflow-hidden flex"
                            key="box"
                        >
                            <motion.div animate={controls} className="w-full flex">
                                <div className="w-full flex-shrink-0">
                                    <CreateTask />
                                </div>
                                <div className="w-full flex-shrink-0">
                                    <CreatePocket />
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <button 
                    className={`
                        rounded-full ml-auto lg:ml-0 py-2 pr-2 pl-2 lg:pl-4 flex items-center justify-center lg:justify-between text-white text-sm w-10 h-10 lg:h-auto lg:w-full transition duration-150 
                        ${taskPopup.open ? "bg-indigo-600 hover:bg-indigo-800" : "bg-gray-900 hover:bg-black"}
                    `}
                    onClick={() => toggleTaskPopup("task")}
                >
                    <div className="flex items-center gap-4">
                        <span className={taskPopup.open ? "rotate-180" : ""}>
                            <Image src={arrowUpIcon} alt="arrow-icon" />
                        </span>
                        <p className="hidden lg:block">Create new task</p>
                    </div>
                    <div className="hidden lg:flex items-center gap-2">
                        {taskPopup.open ? (
                            <>
                                <Image src={cmdIconPurple} alt="cmd-icon" />
                                <Image src={shortcutIconPurple} alt="shortcut-icon" />
                            </>
                        ) : (
                            <>
                                <Image src={cmdIconDark} alt="cmd-icon" />
                                <Image src={shortcutIconDark} alt="shortcut-icon" />
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    )
}
