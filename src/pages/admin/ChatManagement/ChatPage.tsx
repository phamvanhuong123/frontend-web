import React from 'react';
import { Box, Container } from '@mui/material';
import ChatWindow from '~/components/Chat/ChatWindow';

const ChatPage: React.FC = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ height: 'calc(100vh - 64px)', mt: 2 }}>
                <ChatWindow />
            </Box>
        </Container>
    );
};

export default ChatPage; 