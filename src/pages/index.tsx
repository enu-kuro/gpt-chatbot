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

interface gptMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatHistoryProps {
  chatHistory: gptMessage[];
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
  message: gptMessage;
  index: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === "user";
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
      <Text fontSize="sm" color={color} whiteSpace="pre-wrap">
        {message.content}
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
  const [chatHistory, setChatHistory] = useState<gptMessage[]>([
    {
      role: "assistant",
      content:
        "私は旅行コンシェルジュです。旅行についてなんでも気軽にご相談ください！",
    },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSendMessage = async (message: string) => {
    const messageWithUser: gptMessage = {
      role: "user",
      content: message,
    };

    setChatHistory((prevChatHistory) => [...prevChatHistory, messageWithUser]);

    try {
      setIsLoading(true);
      const response = await fetch("/api/bot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: [...chatHistory, messageWithUser] }),
      });

      const botMessage = (await response.json()) as gptMessage;

      // const botMessage: gptMessage = {
      //   role: "assistant",
      //   content: data?.baseChoice?.text,
      // };
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
