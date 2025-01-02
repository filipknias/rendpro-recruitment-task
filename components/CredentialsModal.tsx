"use client";

import { completeUserProfile } from "@/server/actions/auth";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

type FormData = {
    firstName: string;
    lastName: string;
}

export default function CredentialsModal() {
    const [file, setFile] = useState<File|null>(null);
    const [submitDisabled, setSubmitDisabled] = useState(true);
    const [error, setError] = useState<string|null>(null);
    
    const { register, handleSubmit, watch } = useForm<FormData>();
    
    const formFields = watch();

    useEffect(() => {
        const { firstName, lastName } = formFields;

        if (!firstName || !lastName) return;

        if (firstName.trim().length !== 0 && lastName.trim().length !== 0 && file) {
            setSubmitDisabled(false);
        } else {
            setSubmitDisabled(true);
        }
    }, [formFields, file]);

    const onSubmit = async (values: FormData) => {
        if (!file) return;
        setError(null);
        try {
            await completeUserProfile({ ...values, avatar: file });
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center px-8">
            <div className="bg-white rounded-3xl p-5 w-full sm:w-1/2 lg:w-1/4">
                <h2 className="text-2xl font-medium mb-1">Almost there!</h2>
                <p className="mb-4 text-sm">We just need some more information...</p>
                {error && <ErrorMessage message={error} />}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input 
                        type="text" 
                        className="bg-gray-100 rounded-lg py-2 px-4 mb-3 w-full" 
                        placeholder="First Name"
                        {...register("firstName", { required: "First name is required" })}
                    />
                    <input 
                        type="text" 
                        className="bg-gray-100 rounded-lg py-2 px-4 mb-3 w-full" 
                        placeholder="Last Name"
                        {...register("lastName", { required: "Last name is required" })}
                    />
                    <div className="flex gap-2 mb-4">
                        <input
                            type="file"
                            id="custom-file-input"
                            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                            hidden
                        />
                        <label htmlFor="custom-file-input" className="bg-gray-100 rounded-lg py-2 px-4 flex-1">
                            <span className={file ? "text-black" : "text-gray-400"}>
                                {file ? file.name : "Click to upload your avatar"}
                            </span>
                        </label>
                        <div className="w-9 h-9 relative">
                            {file ? (
                                <Image 
                                    className="rounded-full object-cover" 
                                    fill 
                                    src={URL.createObjectURL(file)} 
                                    alt={file.name} 
                                />
                            ) : (
                                <div className="rounded-full bg-gray-400 w-full h-full"></div>
                            )}
                        </div>
                    </div>
                    <button 
                        className="rounded-lg py-2 px-4 bg-indigo-600 hover:bg-indigo-700 focus:ring focus:ring-indigo-300 text-white font-semibold transition duration-150 disabled:bg-indigo-300" 
                        disabled={submitDisabled}
                        type="submit"
                    >
                        {submitDisabled ? "Complete information" : "Let’s start!"}
                    </button>
                </form>
            </div>
        </div>
    )
}
