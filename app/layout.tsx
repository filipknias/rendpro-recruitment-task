import { Geist, Geist_Mono, Noto_Color_Emoji } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { Toaster } from 'react-hot-toast';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const notoColorEmoji = Noto_Color_Emoji({
    variable: "--noto-color-emoji",
    subsets: ["emoji"],
    weight: "400",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
            <title>Tasks App</title>
            <meta name='description' content='Description' />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <ReactQueryProvider>
                {children}
                <Toaster position="bottom-right" />
            </ReactQueryProvider>
        </body>
    </html>
  );
}
