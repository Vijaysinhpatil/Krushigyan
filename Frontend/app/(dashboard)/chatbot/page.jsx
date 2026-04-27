"use client";

import { useState } from "react";
import { Bot, SendHorizontal, User, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hello, I am AgriBot. Ask me anything about crops, soil, fertilizer, or plant disease.",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: userText },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userText,
        }),
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text);
      }

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.data },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.message || "Something went wrong." },
        ]);
      }
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Backend server is not connected. Please check port 5000.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col">
      <Card className="flex min-h-[calc(100dvh-11rem)] flex-col overflow-hidden md:min-h-[calc(100vh-10rem)]">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-900">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>AgriBot Assistant</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Online and ready to help
                </p>
              </div>
            </div>
            <Badge>Live</Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-4 md:p-6">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "bot" && <Bot className="mt-2 h-4 w-4" />}

              <div
                className={`max-w-xl rounded-2xl p-3 text-sm ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-emerald-100 text-emerald-900"
                    : "rounded-tl-sm bg-secondary"
                }`}
              >
                {msg.content}
              </div>

              {msg.role === "user" && <User className="mt-2 h-4 w-4" />}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              AgriBot is thinking...
            </div>
          )}
        </CardContent>

        <CardFooter className="block space-y-3 border-t bg-background/90 p-3 sm:p-4 md:p-5">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              "How to treat rust?",
              "Best corn planting time?",
              "Check soil pH",
              "Fertilizer schedule",
            ].map((item) => (
              <Badge
                key={item}
                variant="secondary"
                className="cursor-pointer whitespace-nowrap px-3 py-1"
                onClick={() => setInput(item)}
              >
                {item}
              </Badge>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-2xl border bg-white p-2">
            <Input
              className="border-0 text-sm focus-visible:ring-0"
              placeholder="Ask AgriBot about crops, soil, weather..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />

            <Button
              size="sm"
              className="rounded-xl"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <SendHorizontal className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}