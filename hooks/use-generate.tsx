import { useState, useCallback, useRef, useEffect } from "react";
import { Message, History } from "../lib/typings";
import { streamText, generateText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { v4 } from 'uuid';


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAnswerGeneration = () => {
    const groq = createGroq({ apiKey: process.env.NEXT_PUBLIC_GROQ });
    const model = groq('deepseek-r1-distill-llama-70b');

    const [input, setInput] = useState("");
    const [historyIds, setHistoryIds] = useState<Set<string>>(new Set());
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [history, setHistory] = useState<History[]>([]);
    const messagesRef = useRef<Message[]>([]);

    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const generateAnswer = useCallback(async (currentMessages: Message[]): Promise<void> => {
        setIsLoading(true);

        const lastMessage = currentMessages[currentMessages.length - 1].content;
        console.log(lastMessage);
        try {

            const hyde = await generateText({
                model: groq('llama-3.3-70b-versatile'),
                temperature: 0,
                system: `You are an expert in question answering.
                    First, analyze the question carefully and think step by step.
                    Provide accurate, factual answers based on verified information.`,
                prompt: `Question:
                    ${lastMessage}`,
            });
            const hydeText = hyde.text
            console.log(hydeText)


            const context_response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/getdocuments`, {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: hydeText })
            });
            const data = await context_response.json();
            let context = "No relevant context found.";

            if (data.response) {
                context = data.response;
                console.log("Retrieval Successful")
            } else {
                console.log("Received invalid response format from server");
            }


            const response = streamText({
                model: model,
                temperature: 0,
                maxRetries: 5,
                system: `You are an expert in question answering.
                     First, analyze the question carefully and think step by step.
                     Provide accurate, factual answers based only on the context information.
                     If unsure about any details, clearly state that information might be inaccurate.`,
                prompt: `Current conversation:
                ${messages}

                Context:
                ${context}
                
                Question:
                ${lastMessage}`,
            });

            const assistantMessage: Message = { role: "assistant", content: "" };
            setMessages(prev => [...prev, assistantMessage]);

            let fullResponse = "";
            let thinkBuffer = "";
            let hasPassedThinkTag = false;

            for await (const chunk of response.textStream) {
                if (!hasPassedThinkTag) {
                    thinkBuffer += chunk;
                    const tagIndex = thinkBuffer.indexOf("</think>");
                    if (tagIndex !== -1) {
                        // Extract content after the </think> tag
                        const contentAfterTag = thinkBuffer.slice(tagIndex + "</think>".length);
                        fullResponse += contentAfterTag;
                        hasPassedThinkTag = true;

                        // Update messages with the initial content after the tag
                        setMessages((prev) => {
                            const newMessages = [...prev];
                            const lastMsg = newMessages[newMessages.length - 1];
                            lastMsg.content = fullResponse;
                            return newMessages;
                        });
                    }
                } else {
                    // Continue streaming normally after the </think> tag
                    fullResponse += chunk;
                    await delay(30);
                    setMessages((prev) => {
                        const newMessages = [...prev];
                        const lastMsg = newMessages[newMessages.length - 1];
                        lastMsg.content = fullResponse;
                        return newMessages;
                    });
                }
            }

            console.log("Answer Generation Successful");
        } catch (error) {
            console.error("Submission error:", error);
        } finally {
            setIsLoading(false);
            setInput("");
        }
    }, [model]);

    const addToHistory = useCallback((activeChatId: string) => {
        if (!historyIds.has(activeChatId)) {
            const timestamp = Date.now();
            const id = v4()
            const messagesItem: History = {
                id,
                input: messagesRef.current[messagesRef.current.length - 2].content,
                timestamp,
                messages: messagesRef.current,
            };

            setHistory((prevHistory) => [...prevHistory, messagesItem]);
            setHistoryIds((prevIds) => {
                const newSet = new Set(prevIds);
                newSet.add(id);
                return newSet;
            });
        }
        setMessages([]);
    }, [historyIds, history]);

    const updateHistory = useCallback((activeChatId: string) => {
        const index = history.findIndex(item => item.id === activeChatId);
        setHistory((prevHistory) => {
            const updatedHistory = [...prevHistory];
            updatedHistory[index] = {
                ...updatedHistory[index],
                input: messagesRef.current[messagesRef.current.length - 2].content,
                messages: messagesRef.current,
                timestamp: Date.now(),
            };
            return updatedHistory;
        });
    }, [history])

    return {
        input,
        setInput,
        messages,
        setMessages,
        messagesRef,
        isLoading,
        setIsLoading,
        generateAnswer,
        history,
        addToHistory,
        updateHistory,
        historyIds
    };
};