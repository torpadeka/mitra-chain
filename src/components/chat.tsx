"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE } from "@/declarations/backend/backend.did";
import { Principal } from "@dfinity/principal";
import {
  ChatHandler,
  FrontendConversation,
  FrontendMessage,
} from "@/handler/ChatHandler";
import { useUser } from "@/context/AuthContext";

interface ChatSystemProps {
  userType: "franchisee" | "franchisor";
  currentChat?: string;
}

export function ChatSystem({ userType, currentChat }: ChatSystemProps) {
  const { actor, principal, getUser } = useUser();
  if (!actor || !principal) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <p className="text-muted-foreground">Please log in to view messages</p>
      </div>
    );
  }

  const chatHandler = new ChatHandler(actor);
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(currentChat ? currentChat.toString() : null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<FrontendConversation[]>(
    []
  );
  const [messages, setMessages] = useState<FrontendMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [userNameCache, setUserNameCache] = useState<Record<string, string>>(
    {}
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations and pre-fetch participant names
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const convs =
          await chatHandler.getAllConversationsByPrincipal(principal);
        setConversations(convs);

        // Pre-fetch participant names
        const uniquePrincipals = new Set<string>();
        convs.forEach((conv) => {
          conv.participants.forEach((p) => uniquePrincipals.add(p));
        });
        await Promise.all(
          Array.from(uniquePrincipals).map(async (principalH) => {
            if (!userNameCache[principalH]) {
              const user = await getUser(Principal.fromText(principalH));
              setUserNameCache((prev) => ({
                ...prev,
                [principalH]: user
                  ? user.name
                  : `${principalH.slice(0, 5)}...${principalH.slice(-5)}`,
              }));
            }
          })
        );
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [principal, getUser]);

  // Fetch messages when conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation) {
        try {
          const msgs = await chatHandler.getAllMessagesByConversation(
            Number(selectedConversation)
          );
          msgs.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
          setMessages(msgs);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };
    fetchMessages();
  }, [selectedConversation]);

  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some((p) =>
      (userNameCache[p] || p).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const selectedConv = conversations.find(
    (conv) => conv.conversationId.toString() === selectedConversation
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedConv && principal) {
      try {
        const recipient = selectedConv.participants.find(
          (p) => p !== principal.toText()
        );
        if (recipient) {
          await chatHandler.sendMessage(
            Number(selectedConversation),
            recipient,
            message
          );
          // Refresh messages
          const updatedMessages =
            await chatHandler.getAllMessagesByConversation(
              Number(selectedConversation)
            );
          updatedMessages.sort(
            (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
          );
          setMessages(updatedMessages);
          setMessage("");
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get participant name (async, cached)
  const getParticipantName = async (principalH: string): Promise<string> => {
    if (principalH === principal?.toText()) {
      return "You";
    }
    if (userNameCache[principalH]) {
      return userNameCache[principalH];
    }
    const user = await getUser(Principal.fromText(principalH));
    const name = user
      ? user.name
      : `${principalH.slice(0, 5)}...${principalH.slice(-5)}`;
    setUserNameCache((prev) => ({ ...prev, [principalH]: name }));
    return name;
  };

  // Synchronous display name for rendering
  const getDisplayName = (principalH: string): string => {
    if (principalH === principal?.toText()) {
      return "You";
    }
    return (
      userNameCache[principalH] ||
      `${principalH.slice(0, 5)}...${principalH.slice(-5)}`
    );
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
            {loading ? (
              <div className="p-4">Loading conversations...</div>
            ) : (
              <div className="space-y-1 p-4">
                {filteredConversations.map((conversation) => {
                  const otherParticipant =
                    conversation.participants.find(
                      (p) => p !== principal?.toText()
                    ) || "";
                  return (
                    <div
                      key={conversation.conversationId}
                      onClick={() =>
                        setSelectedConversation(
                          conversation.conversationId.toString()
                        )
                      }
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedConversation ===
                        conversation.conversationId.toString()
                          ? "bg-brand-50 border border-brand-200"
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {getDisplayName(otherParticipant)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm truncate">
                            {getDisplayName(otherParticipant)}
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {messages
                              .filter(
                                (m) =>
                                  m.conversationId ===
                                  conversation.conversationId
                              )
                              .sort(
                                (a, b) =>
                                  b.timestamp.getTime() - a.timestamp.getTime()
                              )[0]
                              ?.timestamp.toLocaleTimeString() || ""}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {messages
                            .filter(
                              (m) =>
                                m.conversationId === conversation.conversationId
                            )
                            .sort(
                              (a, b) =>
                                b.timestamp.getTime() - a.timestamp.getTime()
                            )[0]?.text || ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
                    <AvatarFallback>
                      {getDisplayName(
                        selectedConv.participants.find(
                          (p) => p !== principal?.toText()
                        ) || ""
                      )
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">
                      {getDisplayName(
                        selectedConv.participants.find(
                          (p) => p !== principal?.toText()
                        ) || ""
                      )}
                    </h3>
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
                  {messages
                    .filter(
                      (m) => m.conversationId === Number(selectedConversation)
                    )
                    .map((msg) => (
                      <div
                        key={msg.messageId}
                        className={`flex ${
                          msg.senderPrincipal === principal?.toText()
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            msg.senderPrincipal === principal?.toText()
                              ? "bg-brand-500 text-white"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p
                            className={`text-xs mt-1 ${
                              msg.senderPrincipal === principal?.toText()
                                ? "text-brand-100"
                                : "text-muted-foreground"
                            }`}
                          >
                            {msg.timestamp.toLocaleTimeString()}
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
