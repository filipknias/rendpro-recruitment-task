"use client";

import AuthPageLayout from "@/components/shared/AuthPageLayout";
import Image from "next/image";
import userIcon from "../../public/user-icon.svg";
import keyIcon from "../../public/key-icon.svg";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { loginUser } from "@/server/actions/auth";
import ErrorMessage from "@/components/shared/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { isRedirectError } from "next/dist/client/components/redirect-error";

type FormData = {
    login: string
    password: string
}

export default function SignIn() {
    const { register, formState: { errors }, handleSubmit } = useForm<FormData>();
    const { mutate, error, isPending, data } = useMutation({
        mutationFn: loginUser,
    });

    const onSubmit = async (values: FormData) => {
        mutate(values);
    };

    return (
        <AuthPageLayout>
            <h1 className="text-3xl font-bold mb-8">Login</h1>
            {error && !isRedirectError(error) && <ErrorMessage message={error.message} />}
            {data && data.message && <ErrorMessage message={data.message} />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="bg-gray-100 rounded-lg py-2 px-4 flex items-center gap-2 mb-2">
                    <Image className="w-5 h-5" src={userIcon} alt="user-icon" />
                    <input 
                        type="text" 
                        className="bg-transparent flex-1 outline-none" 
                        placeholder="Username"
                        {...register("login", { required: "Username is required" })}
                    />
                </div>
                {errors.login && <p className="text-sm text-red-500 mb-2">{errors.login.message}</p>}
                <div className="bg-gray-100 rounded-lg py-2 px-4 flex items-center gap-2 mb-2">
                    <Image className="w-5 h-5" src={keyIcon} alt="user-icon" />
                    <input 
                        type="password" 
                        className="bg-transparent flex-1 outline-none" 
                        placeholder="Password" 
                        {...register("password", { required: "Password is required" })}
                    />
                </div>
                {errors.password && <p className="text-sm text-red-500 mb-2">{errors.password.message}</p>}
                <button 
                    className="rounded-lg py-2 px-4 mb-8 bg-indigo-600 hover:bg-indigo-700 focus:ring focus:ring-indigo-300 text-white font-semibold transition duration-150 disabled:bg-indigo-300" 
                    type="submit"
                    disabled={isPending}
                >
                    Login me
                </button>
                <p className="font-medium">
                    <span className="mr-1">Dont have an account?</span>
                    <Link href="/sign-up" className="text-indigo-600 hover:underline">Register now.</Link>
                </p>
            </form>
        </AuthPageLayout>
    )
}
