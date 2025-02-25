// contexts/chat-context.tsx
import React, {createContext} from 'react';
import {Message, History, SelectedQuestion} from '@/lib/typings';

interface ChatContextType {
    input: string;
    setInput: (input: string) => void;
    messages: Message[];
    setMessages: (messages: Message[]) => void;
    isLoading: boolean;
    generateText: (messages: Message[]) => Promise<void>;
    history: History[];
}

const ChatContext = createContext<ChatContextType>({
        input: "",
        setInput: () => {
        },
        messages: [],
        setMessages: () => {
        },
        isLoading: false,
        generateText: () => Promise.resolve(),
        history: [],
    }
);

export default ChatContext;
