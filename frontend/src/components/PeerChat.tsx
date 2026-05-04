"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface Helper {
  name?: string;
  skills: string[];
  topic?: string;
  availability?: string;
  match_percent?: number;
}

interface PeerChatProps {
  helpers: Helper[];
  currentUser: string;
}

const AVATARS = ["🧑‍💻", "👩‍🎓", "🧑‍🔬", "👨‍💻", "👩‍💻"];

// Simulated auto-replies from peers based on context
const AUTO_REPLIES: Record<string, string[]> = {
  default: [
    "Hey! Happy to help 😊 What exactly are you struggling with?",
    "Sure, I can help you with that! When are you free to connect?",
    "Great question! Let me share some resources I used to learn this.",
    "I was in the same boat a few months ago. Here's what worked for me:",
    "Let's set up a 30-min call! What time works for you? 🗓️",
  ],
  react: [
    "React was confusing at first for me too! Start with useState and useEffect — those cover 80% of use cases.",
    "I'd recommend the official React docs, they're surprisingly good now with the Hooks section!",
    "Let's do a quick pair programming session? I can show you a real project I built with React.",
  ],
  python: [
    "Python is super fun! Are you learning it for scripting, data science, or backend?",
    "I'd suggest starting with Kaggle Learn — free and very practical for Python!",
    "What's your current level? Beginner or do you know the basics already?",
  ],
  dsa: [
    "DSA was my biggest challenge! NeetCode 150 problems in order is the best structured approach.",
    "Start with Arrays and Strings, then move to Two Pointers and Sliding Window.",
    "Want to do LeetCode sessions together? Accountability really helps for DSA! 💪",
  ],
};

export default function PeerChat({ helpers, currentUser }: PeerChatProps) {
  const [activeHelper, setActiveHelper] = useState<number | null>(null);
  const [chatKey, setChatKey] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const helper = activeHelper !== null ? helpers[activeHelper] : null;
  const helperName = helper?.name || (activeHelper !== null ? `Peer ${activeHelper + 1}` : "");

  useEffect(() => {
    if (activeHelper === null) return;
    const key = `alignx_chat_${currentUser}_helper${activeHelper}`;
    setChatKey(key);
    const stored = localStorage.getItem(key);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      // Greeting message from helper
      const greeting: Message = {
        id: "greeting",
        senderId: `helper_${activeHelper}`,
        senderName: helperName,
        text: `Hey! I'm ${helperName} 👋 I know ${helper?.skills.slice(0, 3).join(", ")} really well. ${helper?.topic ? `I can especially help with ${helper.topic}.` : ""} What do you need help with?`,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        isMe: false,
      };
      setMessages([greeting]);
      localStorage.setItem(key, JSON.stringify([greeting]));
    }
  }, [activeHelper]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = () => {
    if (!input.trim() || activeHelper === null) return;

    const myMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser,
      senderName: "You",
      text: input.trim(),
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      isMe: true,
    };

    const updated = [...messages, myMsg];
    setMessages(updated);
    localStorage.setItem(chatKey, JSON.stringify(updated));
    setInput("");
    setTyping(true);

    // Auto-reply based on keywords in the message
    const lowerInput = input.toLowerCase();
    let replies = AUTO_REPLIES.default;
    const helperSkills = helper?.skills.map((s) => s.toLowerCase()) || [];
    for (const skill of helperSkills) {
      if (lowerInput.includes(skill) && AUTO_REPLIES[skill]) {
        replies = AUTO_REPLIES[skill];
        break;
      }
    }

    const replyText = replies[Math.floor(Math.random() * replies.length)];

    setTimeout(() => {
      setTyping(false);
      const replyMsg: Message = {
        id: (Date.now() + 1).toString(),
        senderId: `helper_${activeHelper}`,
        senderName: helperName,
        text: replyText,
        time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
        isMe: false,
      };
      const withReply = [...updated, replyMsg];
      setMessages(withReply);
      localStorage.setItem(chatKey, JSON.stringify(withReply));
    }, 1500 + Math.random() * 1000);
  };

  if (!helpers || helpers.length === 0) return null;

  return (
    <motion.section
      id="peer-chat"
      className="max-w-4xl mx-auto px-4 py-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">💬</span>
        <div>
          <h2 className="text-3xl md:text-4xl" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
            Peer <span style={{ color: "var(--marker-purple)" }}>Chat</span>
          </h2>
          <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
            Chat directly with your matched peers
          </p>
        </div>
      </div>

      <div className="sketch-card sketch-border-purple" style={{ padding: 0, overflow: "hidden" }}>
        <div className="flex h-[480px]">
          {/* Sidebar - Helper List */}
          <div className="w-48 sm:w-56 flex-shrink-0 border-r-2 border-dashed" style={{ borderColor: "var(--paper-lines)" }}>
            <div className="p-3 border-b-2 border-dashed" style={{ borderColor: "var(--paper-lines)" }}>
              <p className="text-sm font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>
                💬 Your Peers
              </p>
            </div>
            <div className="overflow-y-auto h-full pb-4">
              {helpers.map((h, idx) => {
                const name = h.name || `Peer ${idx + 1}`;
                const chatStored = localStorage.getItem(`alignx_chat_${currentUser}_helper${idx}`);
                const chatMsgs: Message[] = chatStored ? JSON.parse(chatStored) : [];
                const lastMsg = chatMsgs[chatMsgs.length - 1];
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveHelper(idx)}
                    className="w-full text-left p-3 transition-all"
                    style={{
                      background: activeHelper === idx ? "rgba(139,107,181,0.08)" : "transparent",
                      borderBottom: "1px dashed var(--paper-lines)",
                      borderLeft: activeHelper === idx ? "3px solid var(--marker-purple)" : "3px solid transparent",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">{AVATARS[idx % AVATARS.length]}</span>
                      <span className="text-sm font-bold truncate" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>{name}</span>
                    </div>
                    <p className="text-xs truncate" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                      {lastMsg ? lastMsg.text : h.skills.slice(0, 2).join(", ")}
                    </p>
                    {h.match_percent && (
                      <span className="text-xs font-bold" style={{ color: "var(--marker-purple)" }}>{h.match_percent}% match</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {activeHelper === null ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                <p className="text-4xl mb-3">👆</p>
                <p className="text-lg" style={{ fontFamily: "var(--font-handwritten)", color: "var(--ink-light)" }}>
                  Select a peer to start chatting!
                </p>
                <p className="text-sm mt-1" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
                  Your matched peers are listed on the left.
                </p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-3 border-b-2 border-dashed flex items-center gap-3" style={{ borderColor: "var(--paper-lines)" }}>
                  <span className="text-2xl">{AVATARS[activeHelper % AVATARS.length]}</span>
                  <div>
                    <p className="text-base font-bold" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-dark)" }}>{helperName}</p>
                    <p className="text-xs" style={{ fontFamily: "var(--font-alt)", color: "var(--marker-green)" }}>
                      🟢 Online · {helper?.availability || "Available"}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        className={`flex ${msg.isMe ? "justify-end" : "justify-start"}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <div
                          className="max-w-[80%] px-4 py-2.5 rounded-2xl"
                          style={{
                            background: msg.isMe ? "var(--marker-blue)" : "rgba(255,255,255,0.7)",
                            color: msg.isMe ? "white" : "var(--ink-dark)",
                            border: msg.isMe ? "none" : "1.5px dashed var(--paper-lines)",
                            fontFamily: "var(--font-body)",
                            fontSize: "0.95rem",
                          }}
                        >
                          <p>{msg.text}</p>
                          <p className="text-xs mt-1 opacity-60">{msg.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {typing && (
                    <motion.div className="flex justify-start" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="px-4 py-3 rounded-2xl flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.7)", border: "1.5px dashed var(--paper-lines)" }}>
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full"
                            style={{ background: "var(--marker-purple)" }}
                            animate={{ y: [0, -5, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t-2 border-dashed flex gap-2" style={{ borderColor: "var(--paper-lines)" }}>
                  <input
                    type="text"
                    className="sketch-input flex-1"
                    placeholder={`Message ${helperName}...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || typing}
                    className="sketch-btn sketch-btn-primary !text-base !py-2 !px-4"
                    style={{ opacity: (!input.trim() || typing) ? 0.6 : 1 }}
                  >
                    Send 💬
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <p className="text-center text-xs mt-3" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
        💡 Chat history is saved locally · Peers respond automatically based on context
      </p>
    </motion.section>
  );
}
