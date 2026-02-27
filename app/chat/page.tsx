
"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/lib/chat-store";
import { useFolderStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Bot, User, Sparkles, Trash2, BrainCircuit } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
    const { messages, conversationId, isLoading, sendMessage, clearChat } = useChatStore();
    const { externalApiUrl } = useFolderStore();
    const [input, setInput] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        const currentInput = input;
        setInput("");
        await sendMessage(currentInput, externalApiUrl);
    };

    return (
        <div className="flex h-screen w-full flex-col bg-background p-4 md:p-6 lg:p-10">
            <Card className="mx-auto flex h-full w-full max-w-5xl flex-col overflow-hidden border-none shadow-2xl ring-1 ring-border">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <BrainCircuit className="h-6 w-6" />
                        </div>
                        <div>
                            <CardTitle className="text-xl font-bold">SageX3 Intelligent Assistant</CardTitle>
                            <CardDescription className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                                </span>
                                Expert Documentation & Workflow ERP
                            </CardDescription>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={clearChat} title="Nouvelle conversation">
                        <Trash2 className="h-5 w-5 text-muted-foreground transition-colors hover:text-destructive" />
                    </Button>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden p-0">
                    <ScrollArea className="h-full w-full px-6 py-4">
                        <div className="flex flex-col gap-6">
                            {messages.length === 0 && (
                                <div className="flex h-[400px] flex-col items-center justify-center text-center">
                                    <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary">
                                        <Sparkles className="h-10 w-10" />
                                    </div>
                                    <h3 className="text-2xl font-semibold">Comment puis-je vous aider ?</h3>
                                    <p className="mt-2 max-w-md text-muted-foreground">
                                        Posez des questions sur le paramétrage Sage X3, les workflows de commande d'achat,
                                        ou la configuration des tables.
                                    </p>
                                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                                        {["Créer un workflow achat", "Paramètres APPPOH", "Config ODBC Sage"].map((suggestion) => (
                                            <Button
                                                key={suggestion}
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full transition-all hover:bg-primary hover:text-primary-foreground"
                                                onClick={() => setInput(suggestion)}
                                            >
                                                {suggestion}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.role === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div className={`flex max-w-[85%] gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                        <Avatar className={`h-9 w-9 border shadow-sm ${msg.role === "assistant" ? "bg-primary text-primary-foreground" : ""}`}>
                                            {msg.role === "assistant" ? (
                                                <div className="flex h-full w-full items-center justify-center bg-primary">
                                                    <Bot className="h-5 w-5" />
                                                </div>
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                                    <User className="h-5 w-5" />
                                                </div>
                                            )}
                                        </Avatar>
                                        <div className={`rounded-2xl px-4 py-2.5 shadow-sm ring-1 ${msg.role === "user"
                                                ? "bg-primary text-primary-foreground ring-primary/20"
                                                : "bg-muted/50 text-foreground ring-border"
                                            }`}>
                                            <div className="prose prose-sm dark:prose-invert max-w-none">
                                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start animate-in fade-in duration-300">
                                    <div className="flex max-w-[85%] gap-3">
                                        <Avatar className="h-9 w-9 border shadow-sm">
                                            <div className="flex h-full w-full items-center justify-center bg-primary">
                                                <Bot className="h-5 w-5 text-primary-foreground" />
                                            </div>
                                        </Avatar>
                                        <div className="flex items-center gap-1 rounded-2xl bg-muted/50 px-4 py-2.5 ring-1 ring-border">
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.3s]"></span>
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/40 [animation-delay:-0.15s]"></span>
                                            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-foreground/40"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </ScrollArea>
                </CardContent>

                <div className="border-t bg-muted/10 p-4 md:p-6 text-center">
                    <div className="relative mx-auto max-w-4xl">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Posez votre question sur Sage X3..."
                            className="h-14 w-full rounded-full border-2 border-primary/20 bg-background pl-6 pr-14 shadow-lg transition-all focus-visible:border-primary focus-visible:ring-primary/20"
                        />
                        <Button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            size="icon"
                            className="absolute right-2 top-2 h-10 w-10 rounded-full shadow-md transition-transform active:scale-95"
                        >
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                    <p className="mt-2 text-[10px] text-muted-foreground/60 uppercase tracking-widest font-semibold">
                        Propulsé par SageX3 RAG Engine • Condensé de 100+ sources
                    </p>
                </div>
            </Card>
        </div>
    );
}
