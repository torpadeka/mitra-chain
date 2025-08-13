"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useAuth } from "@/contexts/auth-context";
import {
  MessageSquare,
  Send,
  Search,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "franchisee" | "franchisor";
  content: string;
  timestamp: string;
  read: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantType: "franchisee" | "franchisor";
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  avatar?: string;
  franchise?: string;
}

interface ChatSystemProps {
  userType: "franchisee" | "franchisor";
}

export function ChatSystem({ userType }: ChatSystemProps) {
  //   const { user } = useAuth();
  const user = {
    id: "1",
    email: "test@example.com",
    firstName: "John",
    lastName: "Doe",
    userType,
    phone: "+1 (555) 123-4567",
  };
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with actual API calls
  const conversations: Conversation[] =
    userType === "franchisee"
      ? [
          {
            id: "1",
            participantId: "franchisor-1",
            participantName: "Green Leaf Cafe Support",
            participantType: "franchisor",
            lastMessage:
              "Thanks for the monthly report. Everything looks great!",
            lastMessageTime: "2 hours ago",
            unreadCount: 0,
            franchise: "Green Leaf Cafe",
          },
          {
            id: "2",
            participantId: "franchisor-2",
            participantName: "Marketing Team",
            participantType: "franchisor",
            lastMessage: "New promotional materials are ready for download",
            lastMessageTime: "1 day ago",
            unreadCount: 2,
            franchise: "Green Leaf Cafe",
          },
        ]
      : [
          {
            id: "1",
            participantId: "franchisee-1",
            participantName: "Sarah Johnson",
            participantType: "franchisee",
            lastMessage: "Question about the new menu items implementation",
            lastMessageTime: "30 minutes ago",
            unreadCount: 1,
            franchise: "Green Leaf Cafe - Seattle",
          },
          {
            id: "2",
            participantId: "franchisee-2",
            participantName: "Mike Chen",
            participantType: "franchisee",
            lastMessage: "Equipment maintenance completed successfully",
            lastMessageTime: "2 hours ago",
            unreadCount: 0,
            franchise: "FitZone Gym - Austin",
          },
          {
            id: "3",
            participantId: "franchisee-3",
            participantName: "Emily Davis",
            participantType: "franchisee",
            lastMessage: "Marketing campaign results exceeded expectations!",
            lastMessageTime: "1 day ago",
            unreadCount: 0,
            franchise: "TechRepair Pro - Denver",
          },
        ];

  const messages: Message[] = [
    {
      id: "1",
      senderId: userType === "franchisee" ? "franchisor-1" : "franchisee-1",
      senderName:
        userType === "franchisee" ? "Green Leaf Support" : "Sarah Johnson",
      senderType: userType === "franchisee" ? "franchisor" : "franchisee",
      content: "Hi! I wanted to follow up on the monthly report submission.",
      timestamp: "10:30 AM",
      read: true,
    },
    {
      id: "2",
      senderId: user?.id || "current-user",
      senderName: user?.firstName + " " + user?.lastName || "You",
      senderType: userType,
      content:
        "Thanks for reaching out! I submitted it yesterday. Did you receive it?",
      timestamp: "10:32 AM",
      read: true,
    },
    {
      id: "3",
      senderId: userType === "franchisee" ? "franchisor-1" : "franchisee-1",
      senderName:
        userType === "franchisee" ? "Green Leaf Support" : "Sarah Johnson",
      senderType: userType === "franchisee" ? "franchisor" : "franchisee",
      content:
        "Yes, I received it. Everything looks great! Your sales numbers are impressive this month.",
      timestamp: "10:35 AM",
      read: true,
    },
    {
      id: "4",
      senderId: user?.id || "current-user",
      senderName: user?.firstName + " " + user?.lastName || "You",
      senderType: userType,
      content:
        "That's wonderful to hear! The new marketing campaign really helped drive traffic.",
      timestamp: "10:37 AM",
      read: true,
    },
  ];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.franchise?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(
    (conv) => conv.id === selectedConversation
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Conversations List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[480px]">
            <div className="space-y-1 p-4">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedConversation === conversation.id
                      ? "bg-brand-50 border border-brand-200"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={conversation.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {conversation.participantName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm truncate">
                        {conversation.participantName}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {conversation.lastMessageTime}
                      </span>
                    </div>
                    {conversation.franchise && (
                      <p className="text-xs text-muted-foreground mb-1">
                        {conversation.franchise}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <Badge
                      variant="default"
                      className="bg-brand-500 text-white text-xs"
                    >
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2">
        {selectedConv ? (
          <>
            {/* Chat Header */}
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={selectedConv.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {selectedConv.participantName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {selectedConv.participantName}
                    </h3>
                    {selectedConv.franchise && (
                      <p className="text-sm text-muted-foreground">
                        {selectedConv.franchise}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="p-0">
              <ScrollArea className="h-[400px] p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.senderId === (user?.id || "current-user")
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          msg.senderId === (user?.id || "current-user")
                            ? "bg-brand-500 text-white"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.senderId === (user?.id || "current-user")
                              ? "text-brand-100"
                              : "text-muted-foreground"
                          }`}
                        >
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t p-4">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type your message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="pr-10"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2"
                    >
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Select a conversation</h3>
              <p className="text-sm text-muted-foreground">
                Choose a conversation from the list to start messaging
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
