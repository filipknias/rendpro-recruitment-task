import { notoColorEmoji } from "@/app/layout";

type Props = {
    emoji: string;
    name: string;
    tasksCount: number;
    isActive: boolean;
    onClick: () => void;
}

export default function PocketLink({ emoji, name, tasksCount, isActive, onClick }: Props) {
    return (
        <button 
            className={`rounded-md p-2 flex justify-between transition duration-150 group ${isActive ? "bg-indigo-600" : "bg-white hover:bg-gray-50"}`}
            onClick={onClick}
        >
            <div className="flex items-center gap-2">
                <span className={`${notoColorEmoji.className}`}>{emoji}</span>
                <p className={`hidden lg:block font-medium text-sm ${isActive ? "text-white" : "text-black"}`}>{name}</p>
            </div>
            <div className={`w-6 h-6 rounded-md hidden lg:flex items-center justify-center text-sm ${isActive ? "bg-indigo-500 text-white" : "bg-gray-50 text-gray-700"}`}>
                {tasksCount}
            </div>
        </button>
    )
}
