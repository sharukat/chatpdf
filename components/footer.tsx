import React from "react";
import { cn } from "../lib/utils";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  return (
    <footer className={cn("p-4 text-center text-gray-500", className)}>
      <small className="text-xs">
        &copy; 2025 Sharuka Thirimanne. All rights reserved.
      </small>
    </footer>
  );
}