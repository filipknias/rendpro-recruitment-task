import Image from "next/image";
import gradientBackground from "@/public/gradient-background.png";

export default function AuthPageLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-screen h-screen relative">
            <Image className="absolute inset-0 w-full h-full" src={gradientBackground} alt="gradient-background" />
            <div className="relative z-10 w-full md:w-1/2 lg:w-1/4 bg-white pt-24 pb-8 px-4 md:px-12 h-full">
                {children}
            </div>
        </div>
    )
}
