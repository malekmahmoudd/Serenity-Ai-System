"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bot, Sparkles, Send } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";
import ConsentModal from "@/components/consent-modal";

// Animation for the header glow
const glowAnimation: Variants = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  },
};
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";
export default function TherapyPage() {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "bot" }[]>([]);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isChatPaused, setIsChatPaused] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  // Chat stays inert until consent is given. The modal handles its own
  // visibility; this flag just gates the input.
  const [consented, setConsented] = useState(false);
  const router = useRouter();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  useEffect(() => {
    if (!isTyping) scrollToBottom();
  }, [messages, isTyping]);

  // Function to call backend
  const sendMessageToBackend = async (message: string) => {
    try {
      // Signed-in users get their conversations tied to their account. The
      // backend accepts anonymous chat too -- a signup wall in front of
      // someone about to disclose something serious is the wrong trade -- so
      // a missing token is fine, not an error.
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message, session_id: sessionId }),
      });
      const data = await res.json();
      if (data.session_id) setSessionId(data.session_id);
      return { gpt_response: data.gpt_response || "No response" };
    } catch (error) {
      return {
        gpt_response:
          "I couldn't reach the server. If this is urgent, please contact your local emergency number or https://findahelpline.com",
      };
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
    setMessage("");
    setIsTyping(true);

    const response = await sendMessageToBackend(userMessage);
    setMessages((prev) => [...prev, { text: response.gpt_response, sender: "bot" }]);
    setIsTyping(false);
  };

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      <div className="flex h-[calc(100vh-4rem)] mt-20 gap-6">
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-background rounded-lg border">

          {/* Header */}
          <div className="p-4 border-b flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">AI Therapist</h2>
              <p className="text-sm text-muted-foreground">{messages.length} messages</p>
            </div>
          </div>

          {/* Chat Area */}
          <div
            className={cn(
              "flex-1 p-4",
              messages.length === 0 ? "flex items-center justify-center" : "flex flex-col overflow-y-auto"
            )}
          >
            {messages.length === 0 ? (
              <div className="max-w-2xl w-full space-y-8 text-center">
                <div className="relative inline-flex flex-col items-center">
                  <motion.div
                    className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"
                    initial="initial"
                    animate="animate"
                    variants={glowAnimation}
                  />
                  <div className="relative flex items-center gap-2 text-2xl font-semibold justify-center">
                    <div className="relative">
                      <Sparkles className="w-6 h-6 text-primary" />
                      <motion.div
                        className="absolute inset-0 text-primary"
                        initial="initial"
                        animate="animate"
                        variants={glowAnimation}
                      >
                        <Sparkles className="w-6 h-6" />
                      </motion.div>
                    </div>
                    <span className="bg-gradient-to-r from-primary/90 to-primary bg-clip-text text-transparent">
                      AI Therapist
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-2">How can I assist you today?</p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col gap-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={cn(
                        "p-3 rounded-lg max-w-[70%] break-words",
                        msg.sender === "user"
                          ? "bg-primary text-black"
                          : "bg-gray-100 dark:bg-gray-800 text-black dark:text-white"
                      )}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white max-w-[70%]">
                      Typing...
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50 p-4">
            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isChatPaused ? "Complete the activity to continue..." : "Ask me anything..."}
                className={cn(
                  "flex-1 resize-none rounded-2xl border bg-background",
                  "p-3 min-h-[36px] max-h-[120px]",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "transition-all duration-200 placeholder:text-muted-foreground/70",
                  (isTyping || isChatPaused) && "opacity-50 cursor-not-allowed"
                )}
                rows={1}
                disabled={isTyping || isChatPaused || !consented}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <button
                type="submit"
                aria-label="Send message"
                className={cn(
                  "flex items-center justify-center rounded-full transition-all duration-200 disabled:opacity-50 hover:bg-primary/80 active:scale-95",
                  message.trim() ? "px-3 py-2 bg-primary text-black" : "w-10 h-10 bg-primary text-black"
                )}
                disabled={isTyping || isChatPaused || !consented || !message.trim()}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-2 text-xs text-center text-muted-foreground">
              Press <kbd className="px-2 py-0.5 rounded bg-muted">Enter ↵</kbd>{" "}
              to send, <kbd className="px-2 py-0.5 rounded bg-muted ml-1">Shift + Enter</kbd> for new line
            </div>
            {/*
              Persistent, not dismissible. The consent modal is shown once; this
              is what a user sees on turn 40 when they have forgotten what this
              is. The crisis number is deliberately one tap away at all times.
            */}
            <div className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground/80">
              Not a substitute for professional care ·{" "}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy
              </a>{" "}
              ·{" "}
              <a href="tel:16328" className="underline hover:text-foreground">
                Get help now: 16328
              </a>
            </div>
          </div>
        </div>
      </div>

      <ConsentModal
        onAccept={() => setConsented(true)}
        onDecline={() => router.push("/")}
      />
    </div>
  );
}
