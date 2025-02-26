export interface Message {
    role: 'user' | 'assistant';
    content: string;
  }

export interface History {
    id: string;
    input: string;
    timestamp: number;
    messages: Message[];
}