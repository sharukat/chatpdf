import {cn} from "../lib/utils";
import {IconRobot, IconUser} from "@tabler/icons-react";
import { MemoizedMarkdown } from './memoized-markdown';


interface MessageProps {
    id: number;
    content: string;
    isUserMessage: boolean;
}

export const Message = ({id, content, isUserMessage}: MessageProps) => {
    const styles = {
        container: isUserMessage ? "bg-gray-100" : "bg-gray-200",
    };

    return (
        <div className={cn("p-3 rounded-3xl mb-2 w-full grid grid-cols-[48px_1fr] gap-5", styles.container)}>
            <div className={cn(
                "w-12 h-12 rounded-full border border-zinc-700 flex justify-center items-center bg-gray-700",
                "flex-shrink-0" // Prevent icon from shrinking
            )}>
                {isUserMessage ? (
                    <IconUser className="size-5 text-white"/>
                ) : (
                    <IconRobot className="size-5 text-white"/>
                )}
            </div>
            <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                        {isUserMessage ? "You" : "AI Assistant"}
                    </span>
                <MemoizedMarkdown id={String(id)} content={content} />
            </div>
        </div>
    );
};