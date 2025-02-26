import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import React from "react";


const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Shyftlab Assessment",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="!scroll-smooth">
            <body className={`${inter.className}`}>
                <Providers>
                    <main>{children}</main>
                </Providers>
            </body>
        </html>
    );
}
