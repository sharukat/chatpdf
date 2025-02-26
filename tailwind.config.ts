import type {Config} from "tailwindcss";

import {heroui} from "@heroui/react";

import tailwindcss_animate from "tailwindcss-animate";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./**/*.{ts,tsx}",
        "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    darkMode: ["class", "class"],
    plugins: [
        heroui({
            defaultTheme: "light",
            themes: {
                light: {
                    colors: {
                        background: "#ffffff",
                    },
                },
                dark: {
                    colors: {
                        background: "#0a0a0a",
                    },
                },
            },
        }),
        tailwindcss_animate
    ],
};
export default config;
