import "./globals.css";
import {Inter} from "next/font/google";
import {Providers} from "./providers";
// import {
//   SidebarProvider,
//   SidebarTrigger,
//   SidebarInset,
// } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
import React from "react";
// import {NavBar} from "@/components/navbar";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
    title: "Swan Lake AI Application",
    description: "AI application for Markham Swan Lake Park.",
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
            {/*<NavBar/>*/}
            <main>{children}</main>
        </Providers>
        </body>
        </html>
    );
}
