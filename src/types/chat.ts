export interface Message {
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
    isCode?: boolean;
    language?: string;
}

export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
} 