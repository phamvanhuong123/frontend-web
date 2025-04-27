import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    TextField,
    IconButton,
    Paper,
    Typography,
    useTheme,
    CircularProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Message } from '~/types/chat';
import { chatApi } from '~/services/axios.chat';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatWindow = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const theme = useTheme();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await chatApi.sendMessage(input);
            const assistantMessage: Message = {
                id: Date.now().toString(),
                content: response.message,
                sender: 'assistant',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            toast.error('Failed to send message');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                bgcolor: theme.palette.background.default,
                p: 2
            }}
        >
            <Paper
                elevation={3}
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    bgcolor: theme.palette.background.paper
                }}
            >
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    {messages.map((message) => (
                        <Box
                            key={message.id}
                            sx={{
                                alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '70%'
                            }}
                        >
                            <Paper
                                elevation={1}
                                sx={{
                                    p: 2,
                                    bgcolor: message.sender === 'user'
                                        ? theme.palette.primary.main
                                        : theme.palette.grey[200],
                                    color: message.sender === 'user'
                                        ? theme.palette.primary.contrastText
                                        : theme.palette.text.primary,
                                    borderRadius: 2
                                }}
                            >
                                <ReactMarkdown
                                    components={{
                                        code({ inline, className, children, ...props }: any) {
                                            const match = /language-(\w+)/.exec(className || '');
                                            if (!inline && match) {
                                                return (
                                                    <SyntaxHighlighter
                                                        style={vscDarkPlus}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                );
                                            } else {
                                                return (
                                                    <code
                                                        className={className}
                                                        style={{
                                                            backgroundColor: inline ? 'rgba(27,31,35,0.05)' : undefined,
                                                            padding: inline ? '2px 4px' : undefined,
                                                            borderRadius: inline ? '4px' : undefined,
                                                            fontSize: inline ? '90%' : undefined,
                                                        }}
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                );
                                            }
                                        },
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                                    {message.timestamp.toLocaleTimeString()}
                                </Typography>
                            </Paper>
                        </Box>
                    ))}
                    {isLoading && (
                        <Box sx={{ alignSelf: 'flex-start' }}>
                            <CircularProgress size={20} />
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </Box>
                <Box
                    sx={{
                        p: 2,
                        borderTop: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        gap: 1
                    }}
                >
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        multiline
                        maxRows={4}
                    />
                    <IconButton
                        color="primary"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                    >
                        <SendIcon />
                    </IconButton>
                </Box>
            </Paper>
        </Box>
    );
};

export default ChatWindow;