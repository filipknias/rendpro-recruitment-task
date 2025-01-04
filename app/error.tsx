"use client";

type PageProps = {
    error: Error;
    reset: () => void;
}

export default function Error({ error, reset }: PageProps) {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-center font-bold text-2xl text-red-500 mb-8">{error.message}</h1>
            <div className="flex justify-center">
                <button 
                    className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-semibold transition duration-150"
                    onClick={reset}
                >
                    Try again
                </button>
            </div>
        </div>
    )
}
