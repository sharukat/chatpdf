"use client";
import React from "react";
import { FloatingNav } from "./ui/floating-navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface NavBarProps {
  className?: string;
}

export function NavBar({ className }: NavBarProps) {
  const navItems = [
    {
      name: "AI Assitant",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Analytics",
      link: "/analytics",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Resources",
      link: "/resources",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  return (
    <div className={cn("relative  w-full", className)}>
      <FloatingNav navItems={navItems} />
    </div>
  );
}
