"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoiceInput({ onTranscript, onSubmit, isLoading }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(12).fill(4));
  const recognitionRef = useRef<any>(null);
  const waveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setIsSupported(!!(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  const startListening = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) return;

    const recognition = new SpeechRec();
    recognition.lang = "en-IN"; // Indian English for better accuracy
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (e: any) => {
      let full = "";
      for (let i = 0; i < e.results.length; i++) {
        full += e.results[i][0].transcript + " ";
      }
      const trimmed = full.trim();
      setTranscript(trimmed);
      onTranscript(trimmed);
    };

    recognition.onerror = () => stopListening();
    recognition.onend = () => {
      setIsListening(false);
      if (waveRef.current) clearInterval(waveRef.current);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);

    // Animate sound waves
    waveRef.current = setInterval(() => {
      setWaveHeights(Array(12).fill(0).map(() => Math.random() * 28 + 4));
    }, 120);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
    if (waveRef.current) clearInterval(waveRef.current);
    setWaveHeights(Array(12).fill(4));
  };

  const toggleListening = () => {
    if (isListening) stopListening();
    else startListening();
  };

  if (!isSupported) return null;

  return (
    <div className="sketch-card sketch-border-purple text-center" style={{ background: "rgba(139,107,181,0.04)" }}>
      {/* Header */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <span className="text-2xl">🎙️</span>
        <h3 className="text-xl" style={{ fontFamily: "var(--font-heading)", color: "var(--marker-purple)" }}>
          Voice Interview Mode
        </h3>
        <span className="sketch-tag !text-xs !py-0.5 !px-2" style={{ borderColor: "var(--marker-green)", color: "var(--marker-green)" }}>
          NEW
        </span>
      </div>

      <p className="text-sm mb-5" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
        Just speak naturally — no forms needed!<br />
        <em>"I know Python and React, I'm in 2nd year CSE, looking for an ML internship in Bangalore"</em>
      </p>

      {/* Voice Waveform */}
      <div className="flex items-center justify-center gap-1 mb-5 h-10">
        {waveHeights.map((h, i) => (
          <motion.div
            key={i}
            animate={{ height: isListening ? h : 4 }}
            transition={{ duration: 0.12, ease: "easeOut" }}
            style={{
              width: "6px",
              height: `${h}px`,
              borderRadius: "99px",
              background: isListening
                ? `hsl(${260 + i * 5}, 60%, 55%)`
                : "var(--paper-lines)",
            }}
          />
        ))}
      </div>

      {/* Record Button */}
      <motion.button
        onClick={toggleListening}
        disabled={isLoading}
        className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-3xl mb-4"
        style={{
          border: `3px ${isListening ? "solid" : "dashed"} var(--marker-purple)`,
          background: isListening ? "var(--marker-purple)" : "rgba(139,107,181,0.1)",
          color: isListening ? "white" : "var(--marker-purple)",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
        whileHover={{ scale: isLoading ? 1 : 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isListening ? { boxShadow: ["0 0 0 0 rgba(139,107,181,0.4)", "0 0 0 16px rgba(139,107,181,0)"] } : {}}
        transition={{ duration: 1, repeat: isListening ? Infinity : 0 }}
      >
        {isListening ? "⏹" : "🎙️"}
      </motion.button>

      <p className="text-sm mb-4" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
        {isListening ? "🔴 Recording... click to stop" : "Click to start speaking"}
      </p>

      {/* Live Transcript */}
      <AnimatePresence>
        {transcript && (
          <motion.div
            className="text-left p-3 mb-4 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            style={{ background: "rgba(139,107,181,0.08)", border: "1.5px dashed var(--marker-purple)" }}
          >
            <p className="text-xs mb-1" style={{ fontFamily: "var(--font-alt)", color: "var(--pencil-gray)" }}>
              📝 What I heard:
            </p>
            <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-medium)", fontStyle: "italic" }}>
              &ldquo;{transcript}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit */}
      {transcript && !isListening && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onSubmit(transcript)}
          disabled={isLoading}
          className="sketch-btn sketch-btn-primary w-full !text-lg !py-3"
        >
          {isLoading ? "✨ AI is analyzing your voice..." : "🚀 Match Me Using This →"}
        </motion.button>
      )}
    </div>
  );
}
