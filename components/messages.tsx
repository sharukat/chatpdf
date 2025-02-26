import {type Message as TMessage} from "../lib/typings";
import {Message} from "./message";

interface MessagesProps {
    messages: TMessage[];
}

export const Messages = ({messages}: MessagesProps) => {
    return (
        <div>
            {messages.length !== 0 && (
                messages.map((message, i) => (
                    <Message key={i} id={i} content={message.content} isUserMessage={message.role === "user"}/>
                ))
            )}
        </div>
    );
};