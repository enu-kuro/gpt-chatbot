import React, { useState } from "react";
import {
  Box,
  Input,
  Button,
  VStack,
  HStack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

interface ChatHistoryProps {
  chatHistory: string[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatHistory }) => {
  return (
    <VStack spacing="3" p="3">
      {chatHistory.map((message, index) => (
        <ChatMessage key={index} message={message} index={index} />
      ))}
    </VStack>
  );
};

interface ChatMessageProps {
  message: string;
  index: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.startsWith("User:");
  const bg = useColorModeValue("gray.100", "gray.800");
  const color = useColorModeValue("black", "white");
  const alignSelf = isUser ? "flex-start" : "flex-end";
  const borderRadius = isUser ? "md" : "none";
  const marginLeft = isUser ? "0" : "auto";
  return (
    <Box
      bg={bg}
      p="2"
      borderRadius={borderRadius}
      alignSelf={alignSelf}
      marginLeft={marginLeft}
      maxWidth="80%"
    >
      <Text fontSize="sm" color={color}>
        {message.replace(/^(You|User):\s+/, "")}
      </Text>
    </Box>
  );
};

const ChatInput: React.FC<{
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <HStack p="3">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        flex="1"
        marginRight={{ base: "0", md: "3" }}
        marginBottom={{ base: "3", md: "0" }}
      />
      <Button
        onClick={handleSendMessage}
        colorScheme="blue"
        isLoading={isLoading}
      >
        Send
      </Button>
    </HStack>
  );
};

const ChatBot: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<string[]>([
    "You: 私は旅行コンシェルジュです。旅行についての質問にお答えいたします。",
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSendMessage = async (message: string) => {
    const messageWithUser = "User: " + message;
    setChatHistory((prevChatHistory) => [...prevChatHistory, messageWithUser]);

    try {
      setIsLoading(true);
      const response = await fetch("/api/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: [...chatHistory, messageWithUser] }),
      });

      const data = await response.json();
      const botMessage = "You:" + data?.baseChoice?.text;

      if (botMessage) {
        setChatHistory((prevChatHistory) => [...prevChatHistory, botMessage]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      border="1px solid"
      borderColor={useColorModeValue("gray.200", "gray.700")}
      borderRadius="md"
      overflow="hidden"
      width={{ base: "100%", md: "600px" }}
      margin="0 auto"
    >
      <ChatHistory chatHistory={chatHistory} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </Box>
  );
};

export default ChatBot;
