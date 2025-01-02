"use client";

import Image from "next/image";
import arrowLeftIndigo from '../public/arrow-left-indigo.svg';
import { notoColorEmoji } from "@/app/layout";
import { emojiCategories } from "@/data/emoji";
import { useState } from "react";
import { createPocket } from "@/server/actions/pockets";
import { useForm } from "react-hook-form";
import { useAppStore } from "@/hooks/useAppStore";

type Props = {
    switchView: () => void;
}

type FormData = {
    name: string;
}

export default function CreatePocket({ switchView }: Props) {
    const [selectedCategory, setSelectedCategory] = useState<keyof typeof emojiCategories>("Smileys");
    const [selectedEmoji, setSelectedEmoji] = useState<string|null>(null);
    const [error, setError] = useState<string|null>(null);
    const { register, formState: { errors }, handleSubmit, setValue } = useForm<FormData>();
    const { addPocket } = useAppStore();

    const onPocketSubmit = async (values: FormData) => {
        if (!selectedEmoji) return;

        setError(null);
        try {
            const newPocket = await createPocket({ name: values.name, emoji: selectedEmoji });
            addPocket(newPocket);
            setValue("name", "");
            setSelectedEmoji(null);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    return (
        <div className="p-5">
            <p 
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition duration-150 mb-4 font-medium text-sm cursor-pointer" 
                onClick={switchView}
            >
                <Image src={arrowLeftIndigo} alt="arrow-left" width={16} height={16} />
                <span>Go back</span>
            </p>
            <form onSubmit={handleSubmit(onPocketSubmit)}>
                <div className="bg-gray-50 py-2 px-3 flex items-center rounded-lg mb-4">
                    <span className={`w-6 h-6 ${notoColorEmoji.className}`}>{selectedEmoji}</span>
                    <input 
                        type="text" 
                        className="flex-1 text-sm ml-3 bg-transparent focus:outline-none" 
                        placeholder="Create new pocket"
                        {...register("name", { required: "Pocket name is required" })}
                    />
                    <button 
                        className="bg-gray-200 hover:bg-gray-200 transition duration-150 rounded-lg py-2 px-3 text-sm text-black font-semibold"
                    >
                        Create
                    </button>
                </div>   
            </form>
            <p className="text-sm font-medium text-black mb-2">Select emoji</p> 
            <div className="flex mb-3 whitespace-nowrap overflow-x-auto">
                {Object.keys(emojiCategories).map((category, index, arr) => (
                    <button 
                        className={`
                            py-1 px-3 text-center text-sm font-medium flex-1 
                            ${selectedCategory === category ? "bg-indigo-600 text-white" : "bg-gray-50 text-gray-800"}
                            ${index === 0 ? "rounded-tl-lg rounded-bl-lg" : index === arr.length - 1 ? "rounded-tr-lg rounded-br-lg" : ""}
                        `}
                        key={category}
                        onClick={() => setSelectedCategory(category as keyof typeof emojiCategories)}
                    >
                        {category}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-10">
                {emojiCategories[selectedCategory].map((emoji) => (
                    <button 
                        className={`w-8 h-8 flex items-center justify-center text-center rounded-full transition duration-150 ${selectedEmoji === emoji ? "bg-indigo-200" : "hover:bg-gray-100"}`}
                        onClick={() => setSelectedEmoji(emoji)}
                        key={emoji}
                    >
                        <span className={notoColorEmoji.className}>{emoji}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}
