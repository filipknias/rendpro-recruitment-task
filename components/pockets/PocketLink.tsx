import { notoColorEmoji } from "@/fonts/noto-emoji";

type Props = {
    emoji: string;
    name: string;
    tasksCount: number;
    isActive: boolean;
    onClick: () => void;
    isResponsive: boolean;
}

export default function PocketLink({ emoji, name, tasksCount, isActive, onClick, isResponsive }: Props) {
    return (
        <button 
            className={`rounded-md p-2 flex justify-between transition duration-150 group ${isActive ? "bg-indigo-600" : "bg-white hover:bg-gray-50"}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-2">
                <span className={`${notoColorEmoji.className}`}>{emoji}</span>
                <p className={`font-medium text-sm ${isActive ? "text-white" : "text-black"} ${isResponsive ? "hidden lg:block" : ""}`}>{name}</p>
            </div>
            <div className={`
                w-6 h-6 rounded-md flex items-center justify-center text-sm 
                ${isActive ? "bg-indigo-500 text-white" : "bg-gray-50 text-gray-700"}
                ${isResponsive ? "hidden lg:block" : ""}
            `}>
                {tasksCount}
            </div>
        </button>
    )
}
