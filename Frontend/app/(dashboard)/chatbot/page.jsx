"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, SendHorizontal, User, Loader2, Mic, MicOff, Languages, Volume2, VolumeX } from "lucide-react";

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
import { BASE_URL } from "@/utils/api";

export default function ChatbotPage() {
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("en");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Hello, I am AgriBot. Ask me anything about crops, soil, fertilizer, or plant disease.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setMessages(prev => [...prev, { role: "bot", content: "Speech recognition is not supported in this browser. Please type." }]);
      return;
    }

    // Always create a fresh instance for better stability and network recovery
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    
    recognition.continuous = false;
    recognition.interimResults = false;
    
    if (language === 'hi') recognition.lang = 'hi-IN';
    else if (language === 'mr') recognition.lang = 'mr-IN';
    else if (language === 'kn') recognition.lang = 'kn-IN';
    else recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Auto send the message
      handleSendWithText(transcript);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      
      let errorMsg = "";
      if (event.error === 'network') {
        errorMsg = "Check internet connection. Voice not working, please type.";
      } else if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        errorMsg = "Microphone permission denied. Please allow microphone access in your browser settings.";
      } else if (event.error === 'no-speech') {
        errorMsg = "No speech detected, try again.";
      } else {
        errorMsg = `Voice error: ${event.error}. Voice not working, please type.`;
      }
      
      setMessages(prev => [...prev, { role: "bot", content: errorMsg }]);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Mic error", e);
      setMessages(prev => [...prev, { role: "bot", content: "Could not start microphone. Voice not working, please type." }]);
      setIsListening(false);
    }
  };

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      if (lang === 'hi') utterance.lang = 'hi-IN';
      else if (lang === 'mr') utterance.lang = 'mr-IN';
      else if (lang === 'kn') utterance.lang = 'kn-IN';
      else utterance.lang = 'en-US';

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Main wrapper for button click
  const handleSend = () => {
    handleSendWithText(input);
  };

  const handleSendWithText = async (textToSend) => {
    if (!textToSend || !textToSend.trim()) return;

    // Prevent overlapping sends
    if (loading) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", content: textToSend },
    ]);

    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${BASE_URL}/api/ai/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          message: textToSend,
          language: language
        }),
      });

      const text = await response.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        throw new Error("Invalid response format from server");
      }

      if (data.success) {
        const botReply = data.data.message;
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: botReply },
        ]);
        
        if (autoSpeak) {
          speakText(botReply, data.data.language || language);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.message || "I encountered an error processing your request." },
        ]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Backend server connection failed. Please ensure the server is running on port 5000.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col space-y-4">
      {/* Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
        <div className="flex items-center gap-2">
          <Languages className="h-5 w-5 text-emerald-700" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
          >
            <option value="en">English</option>
            <option value="hi">Hindi (हिंदी)</option>
            <option value="mr">Marathi (मराठी)</option>
            <option value="kn">Kannada (ಕನ್ನಡ)</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={autoSpeak ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "text-muted-foreground"}
          >
            {autoSpeak ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
            {autoSpeak ? "Voice Reply: ON" : "Voice Reply: OFF"}
          </Button>
          
          {isSpeaking && (
            <Button variant="destructive" size="sm" onClick={stopSpeaking}>
              Stop Audio
            </Button>
          )}
        </div>
      </div>

      <Card className="flex min-h-[calc(100dvh-16rem)] flex-col overflow-hidden md:min-h-[calc(100vh-14rem)]">
        <CardHeader className="border-b bg-emerald-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow-sm">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-emerald-900">AgriBot</CardTitle>
                <p className="text-xs text-emerald-700 font-medium">
                  Smart Farming Assistant
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-600">Online</Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-4 overflow-y-auto p-3 sm:p-4 md:p-6 bg-slate-50">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "bot" && (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm whitespace-pre-wrap shadow-sm ${
                  msg.role === "user"
                    ? "rounded-tr-sm bg-emerald-600 text-white"
                    : "rounded-tl-sm bg-white border border-emerald-100 text-slate-800"
                }`}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-sm text-emerald-700 bg-white p-3 rounded-2xl rounded-tl-sm w-fit border border-emerald-100 shadow-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              AgriBot is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="block space-y-3 border-t bg-white p-3 sm:p-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {[
              "How to treat wheat rust?",
              "Best fertilizer for sugarcane",
              "When to water tomatoes?",
              "Organic pest control",
            ].map((item) => (
              <Badge
                key={item}
                variant="outline"
                className="cursor-pointer whitespace-nowrap px-3 py-1.5 hover:bg-emerald-50 hover:text-emerald-700 border-emerald-200 text-slate-600 transition-colors"
                onClick={() => setInput(item)}
              >
                {item}
              </Badge>
            ))}
          </div>

          <div className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                className="flex w-full rounded-2xl border border-slate-300 bg-transparent px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-500 min-h-[50px] max-h-[120px] resize-none"
                placeholder={isListening ? "Listening... Please speak now." : "Ask AgriBot..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                disabled={isListening}
              />
            </div>

            <Button
              size="icon"
              variant={isListening ? "destructive" : "secondary"}
              className={`h-[50px] w-[50px] shrink-0 rounded-full transition-colors ${
                isListening ? "animate-pulse" : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              }`}
              onClick={toggleListening}
              title="Voice Input"
            >
              {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              size="icon"
              className="h-[50px] w-[50px] shrink-0 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-transform hover:scale-105 active:scale-95"
              onClick={handleSend}
              disabled={loading || (!input.trim() && !isListening)}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendHorizontal className="h-5 w-5 ml-1" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}