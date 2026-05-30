"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MessageCircle, Send, User } from "lucide-react";

export const dynamic = "force-dynamic";

interface ChatItem {
  id: string;
  otherUser: {
    id: string;
    name: string;
    avatar: string | null;
  };
  lastMessage: string;
  updatedAt: string;
}

interface Message {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  user: { id: string; name: string };
}

export default function ChatPage() {
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatItem | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetch("/api/chats")
        .then((res) => res.json())
        .then((data) => {
          setChats(data);
          if (data.length > 0) {
            setSelectedChat(data[0]);
          }
        });
    }
  }, [session]);

  useEffect(() => {
    if (selectedChat) {
      fetch(`/api/chats/${selectedChat.id}`)
        .then((res) => res.json())
        .then((data) => setMessages(data.chat?.messages || []));
    }
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedChat) return;

    const response = await fetch("/api/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        otherUserId: selectedChat.otherUser.id,
        message: inputMessage,
      }),
    });

    if (response.ok) {
      setInputMessage("");
      fetch(`/api/chats/${selectedChat.id}`)
        .then((res) => res.json())
        .then((data) => setMessages(data.chat?.messages || []));
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">请先登录</p>
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="px-6 py-2 bg-primary text-white rounded-lg"
          >
            立即登录
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <Header
        currentCity=""
        onCityChange={() => {}}
        onSearch={() => {}}
      />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden h-[calc(100vh-200px)] flex flex-col md:flex-row">
          <div className="md:w-80 border-b md:border-b-0 md:border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-bold">消息中心</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              {chats.length > 0 ? (
                <div className="divide-y divide-border">
                  {chats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full flex items-center gap-3 p-4 text-left transition-colors ${
                        selectedChat?.id === chat.id
                          ? "bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                    >
                      {chat.otherUser.avatar ? (
                        <img
                          src={chat.otherUser.avatar}
                          alt={chat.otherUser.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <User className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{chat.otherUser.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {chat.lastMessage || "暂无消息"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <MessageCircle className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">暂无消息</h3>
                  <p className="text-muted-foreground">开始与他人聊天吧</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                <div className="p-4 border-b border-border flex items-center gap-3">
                  {selectedChat.otherUser.avatar ? (
                    <img
                      src={selectedChat.otherUser.avatar}
                      alt={selectedChat.otherUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">{selectedChat.otherUser.name}</h3>
                    <p className="text-sm text-muted-foreground">在线</p>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => {
                    const isOwn = message.userId === session.user.id;
                    return (
                      <div
                        key={message.id}
                        className={`flex gap-3 ${
                          isOwn ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${
                            isOwn
                              ? "bg-primary text-white rounded-tr-md"
                              : "bg-muted rounded-tl-md"
                          }`}
                        >
                          <p>{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isOwn ? "text-white/70" : "text-muted-foreground"
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-4 border-t border-border">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="输入消息..."
                      className="flex-1 px-4 py-3 rounded-xl border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                      className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto flex items-center justify-center mb-4">
                    <MessageCircle className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">选择一个聊天</h3>
                  <p className="text-muted-foreground">从左侧列表选择对话开始聊天</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
