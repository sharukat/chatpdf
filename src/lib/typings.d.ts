export interface Questions{
    category: string;
    questions: string[];
}

export interface SelectedQuestion {
    key: string | null;
    questionIndex: number | null;
}

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