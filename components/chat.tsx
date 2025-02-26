"use client";

import {Button, Textarea} from "@heroui/react";
import { ArrowUp } from "lucide-react";
import React, { useCallback, useMemo, useContext, useState } from "react";
import { Messages } from "./messages";
import { Message } from "../lib/typings";
import { cn } from "../lib/utils";
import ChatContext from "../contexts/chat-context";
import { FileUpload } from "./ui/file-upload";
import toast, { Toaster } from "react-hot-toast";

export const Chat = () => {
    const context = useContext(ChatContext);
    const memoizedMessages = useMemo(() => context.messages, [context.messages]);
    const [dbStatus, setDbStatus] = useState(false);
    const [dbLoading, setDbLoading] = useState(false);

    const [files, setFiles] = useState<File[]>([]);
    const handleFileUpload = (files: File[]) => {
        setFiles(files);
        console.log(files);
    };


    const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!context.input.trim()) return;

        const newUserMessage: Message = {
            role: "user",
            content: context.input,
        };
        const updatedMessages = [...context.messages, newUserMessage];
        context.setMessages(updatedMessages);

        try {
            await context.generateText(updatedMessages);
        } catch (error) {
            console.error("Error generating response:", error);
        }
    }, [context]);

    const handleAddtoDB = useCallback(async () => {
        if (files.length === 0) return;

        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`file${index}`, file);
        });

        try {
            setDbLoading(true);
                
            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setFiles([]);
            toast.success("Vector database created.");
            console.log(data.message)
            setDbStatus(true)
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setDbLoading(false);
        }
    }, [files, context]);

    return (
        <div className="flex flex-1">
            <Toaster />
            <div
                className="p-2 md:p-10 rounded-tl-2xl border  bg-white flex flex-col gap-2 flex-1 w-full h-full items-center">
                <div className="flex flex-col gap-2 w-full">
                    <div className="w-full max-w-5xl items-center mx-auto">

                        <div className="flex flex-col gap-2">
                            {memoizedMessages && (
                                <div
                                    className="text-black max-h-[calc(100vh-300px)] overflow-y-auto">
                                    <></>
                                    <Messages messages={context.messages} />
                                </div>
                            )}
                            <div className="h-[calc(100vh-500px)] flex flex-col items-center justify-center">
                                {context.messages.length === 0 && (
                                    <h1 className="max-w-4xl text-center py-5 font-semibold text-black text-xl md:text-2xl">
                                        Ask any question about the document?
                                    </h1>
                                )}

                                <div className={cn(
                                    "flex flex-col w-full max-w-5xl mx-auto",
                                    context.messages.length !== 0 && "flex flex-col w-full mx-auto fixed bottom-10"
                                )}>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="relative flex flex-col mx-auto w-full"
                                    >
                                        <Textarea
                                            placeholder="Ask any question?"
                                            variant="flat"
                                            radius="full"
                                            value={context.input}
                                            onChange={(e) => context.setInput(e.target.value)}
                                            isDisabled={context.isLoading}
                                        />
                                        {context.input && <Button
                                            className="absolute right-2 bottom-2 z-10 bg-gray-900"
                                            isLoading={context.isLoading}
                                            isIconOnly
                                            size="sm"
                                            radius="full"
                                            type="submit"
                                            color="primary"
                                            isDisabled={context.isLoading || !dbStatus}
                                        >
                                            <ArrowUp className="text-white" />
                                        </Button>}
                                    </form>
                                    {context.messages.length === 0 && (
                                        <div className="flex flex-col items-center">
                                            <FileUpload onChange={handleFileUpload} />
                                            <Button
                                                className="max-w-3xl"
                                                isLoading={dbLoading}
                                                radius="full"
                                                onPress={handleAddtoDB}
                                                color="primary"
                                                isDisabled={files.length === 0 || dbStatus}
                                            >Create Vector Database</Button>
                                        </div>

                                    )}


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}