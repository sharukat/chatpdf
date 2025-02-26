"use client";

import React, {useEffect, useState} from "react";
import {Sidebar, SidebarBody} from "../components/ui/sidebar";
import {cn} from "../lib/utils";
import {Button} from "@heroui/react";
import {Plus, PanelLeft} from "lucide-react";
import ChatContext from "../contexts/chat-context";
import {Chat} from "../components/chat";
import {useAnswerGeneration} from "../hooks/use-generate";
import {Message, SelectedQuestion} from "../lib/typings";

export default function ChatPage() {
    const [open, setOpen] = useState(false);
    const [activeChatId, setActiveChatId] = useState<string>("");

    const {
        messages,
        setMessages,
        input,
        setInput,
        generateText,
        history,
        addToHistory,
        updateHistory,
        isLoading,
    } = useAnswerGeneration();


    const handleNewChat = () => {
        addToHistory(activeChatId);
    };

    const handleHistoryClick = (selectedMessages: Message[], historyId: string) => {
        setActiveChatId(historyId);
        setMessages(selectedMessages);
    };

    useEffect(() => {
        if (activeChatId && messages.length > 0) {
            updateHistory(activeChatId);
        }
    }, [messages]);



    return (
        <ChatContext.Provider value={{
            input,
            setInput,
            messages,
            setMessages,
            isLoading,
            generateText,
            history,
        }}>
            <div
                className={cn(
                    "h-screen rounded-md flex flex-col md:flex-row bg-gray-100 w-full flex-1 mx-auto border border-neutral-200  overflow-hidden",
                )}
            >
                <Sidebar open={open} setOpen={setOpen}>
                    <SidebarBody className="justify-between gap-10">
                        <div className="flex flex-col overflow-y-auto overflow-x-hidden">
                            <Button
                                className="font-bold mb-3"
                                color="default"
                                radius="full"
                                isIconOnly
                                size="sm"
                            >
                                <PanelLeft/>
                            </Button>
                            {(open) && (
                                <div className="flex flex-col flex-1">
                                    <Button
                                        className="font-bold mb-3"
                                        color="success"
                                        radius="full"
                                        size="md"
                                        onPress={handleNewChat}
                                        startContent={<Plus/>}
                                    >
                                        New Chat
                                    </Button>
                                    <span className="font-bold text-center">Chat History</span>
                                </div>
                            )}
                            {(open) && (
                                <div className="flex flex-col gap-2 mt-2">
                                    {history.map((item, idx) => (
                                        <Button key={idx} className="text-left truncate block w-full" onPress={() => handleHistoryClick(item.messages, item.id)}>
                                            {item.input}
                                        </Button>
                                    ))}
                                </div>
                            )}

                        </div>
                    </SidebarBody>
                </Sidebar>
                <Chat/>
            </div>
        </ChatContext.Provider>
    );
}

