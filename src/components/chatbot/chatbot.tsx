"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import { Bot, Loader2, Send, X, Sparkles, Trash2 } from "lucide-react"
import { BotMessageSquareIcon } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { chatWithVajra } from "@/ai/flows/chatWithVajra"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback } from "../ui/avatar"

type Message = {
  role: "user" | "model"
  content: string
}

const allSuggestedQueries = [
    "What is Winding Deformation?",
    "Explain the difference between High and Low criticality.",
    "What does 'Needs Attention' status mean?",
    "How do you identify an Inter-turn Short?",
    "What is FRA?",
    "What causes a bushing fault?",
    "What is the difference between FRA and DGA?",
    "What is the Health Compass for?",
];

const initialMessages: Message[] = [
    {
      role: "model",
      content: "Hello! I'm Vajra Assistant. How can I help you with your transformer diagnostics today?",
    },
]

// Function to shuffle array and get top N items
const getShuffledQueries = (lastQuery: string, count: number) => {
    const filteredQueries = allSuggestedQueries.filter(q => q !== lastQuery);
    const shuffled = filteredQueries.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}


export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isPending, startTransition] = useTransition()
  const [suggestedQueries, setSuggestedQueries] = useState<string[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Initialize suggested queries
    setSuggestedQueries(getShuffledQueries("", 4));
  }, []);

  const toggleChat = () => {
      setIsOpen(prev => {
          if (!prev) {
            setTimeout(() => inputRef.current?.focus(), 100);
          }
          return !prev
      })
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
    }
  }

  const sendQuery = (query: string) => {
    const userMessage: Message = { role: "user", content: query };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);

    startTransition(async () => {
      try {
        const { response } = await chatWithVajra({
          history: newMessages, // Send the most up-to-date history
          message: query,
        });
        const botMessage: Message = { role: "model", content: response };
        setMessages(prev => [...prev, botMessage]);
        // After getting a response, update the suggested queries
        setSuggestedQueries(getShuffledQueries(query, 4));
      } catch (error) {
        console.error("Chatbot error:", error);
        toast({
          title: "Chatbot Error",
          description: "There was an issue communicating with the AI. Please try again.",
          variant: "destructive",
        });
        // Revert to the state before the user's message was added
        setMessages(prev => prev.slice(0, -1));
      }
    });
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!input || isPending) return

    const currentInput = input;
    setInput("")
    sendQuery(currentInput);
  }
  
  const handleClearChat = () => {
      setMessages(initialMessages);
      setSuggestedQueries(getShuffledQueries("", 4));
      toast({
          title: "Chat Cleared",
          description: "The conversation history has been cleared.",
      });
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        <Button size="icon" className="rounded-full w-14 h-14 shadow-lg" onClick={toggleChat}>
          {isOpen ? <X className="w-6 h-6" /> : <BotMessageSquareIcon className="w-6 h-6" />}
          <span className="sr-only">Toggle Chatbot</span>
        </Button>
      </div>

      <div 
        className={cn(
            "fixed bottom-24 right-6 z-50 transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
          <Card className="w-[380px] h-[550px] flex flex-col shadow-2xl">
            <CardHeader className="flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-primary/10 rounded-full border border-primary/20">
                    <BotMessageSquareIcon className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                    <CardTitle className="text-xl">Vajra Assistant</CardTitle>
                    <CardDescription>AI-Powered Diagnostics Helper</CardDescription>
                 </div>
              </div>
              <div className="flex items-center">
                 <Button variant="ghost" size="icon" onClick={handleClearChat} className="h-8 w-8" disabled={messages.length <= initialMessages.length}>
                    <Trash2 className="w-4 h-4"/>
                    <span className="sr-only">Clear chat</span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                    <X className="w-4 h-4"/>
                    <span className="sr-only">Close chat</span>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full" ref={scrollAreaRef}>
                    <div className="p-6 space-y-6">
                    {messages.map((message, index) => (
                        <div key={index} className={cn("flex gap-3", message.role === "user" ? "justify-end" : "justify-start")}>
                         {message.role === "model" && (
                            <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                                <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                            </Avatar>
                         )}
                        <div className={cn(
                            "max-w-[80%] rounded-lg px-4 py-2 text-sm",
                            message.role === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}>
                            {message.content}
                        </div>
                        </div>
                    ))}
                    {isPending && (
                        <div className="flex gap-3 justify-start">
                             <Avatar className="w-8 h-8 bg-primary text-primary-foreground">
                                <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                            </Avatar>
                             <div className="bg-muted max-w-[80%] rounded-lg px-4 py-2 text-sm flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin"/>
                               <span>Thinking...</span>
                            </div>
                        </div>
                    )}
                     {!isPending && (
                        <div className="space-y-4 pt-4">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-primary" />
                                <p className="text-sm font-medium text-muted-foreground">Suggested Queries</p>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {suggestedQueries.map((query) => (
                                    <Button
                                        key={query}
                                        variant="outline"
                                        size="sm"
                                        className="h-auto whitespace-normal justify-start text-left"
                                        onClick={() => sendQuery(query)}
                                        disabled={isPending}
                                    >
                                        {query}
                                    </Button>
                                ))}
                            </div>
                        </div>
                     )}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                 <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 relative">
                    <Input
                        ref={inputRef}
                        id="message"
                        placeholder="Ask about a fault type..."
                        className="flex-1 pr-12"
                        autoComplete="off"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isPending}
                    />
                    <Button type="submit" size="icon" className="absolute right-1 w-8 h-8" disabled={isPending || !input}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </CardFooter>
          </Card>
      </div>
    </>
  )
}
