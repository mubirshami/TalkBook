"use client"

import { useState, useRef, useEffect } from "react"
import { VoiceWaveform } from "@/components/VoiceWaveform"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Mic, MicOff, Volume2, VolumeX, Pause, Play,
  ArrowLeft, BookOpen, ChevronLeft, ChevronRight,
  PhoneOff, Send, RotateCcw
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

/* ── Mock data ──────────────────────────────────────────── */
const MOCK_BOOK = {
  title: "Atomic Habits",
  author: "James Clear",
  chapters: [
    "Introduction",
    "The Surprising Power of Atomic Habits",
    "How Your Habits Shape Your Identity",
    "How to Build Better Habits in 4 Simple Steps",
    "The Man Who Didn't Look Like an Athlete",
    "The Best Way to Start a New Habit",
  ],
}

const INITIAL_MESSAGES = [
  {
    id: "1",
    role: "ai" as const,
    text: "Hi! I'm ready to discuss Atomic Habits by James Clear. You can ask me anything — about specific chapters, key concepts, or ideas you want to explore. What would you like to talk about?",
    time: "Just now",
  },
]

const AI_RESPONSES = [
  "That's a great question! In Atomic Habits, James Clear argues that small 1% improvements, compounded over time, lead to remarkable results. The key is to focus on systems, not goals.",
  "James Clear introduces the concept of identity-based habits — instead of saying 'I want to run a mile', you say 'I am a runner'. This shift makes habits stick because they become part of who you are.",
  "The Four Laws of Behaviour Change are: make it obvious, make it attractive, make it easy, and make it satisfying. To break a bad habit, you invert these — make it invisible, unattractive, difficult, and unsatisfying.",
  "The Habit Loop consists of a cue, a craving, a response, and a reward. Understanding this loop is key to both building new habits and breaking old ones.",
]

interface Message {
  id: string
  role: "user" | "ai"
  text: string
  time: string
}

export default function ChatPage({ params }: { params: { id: string } }) {
  const [messages, setMessages]       = useState<Message[]>(INITIAL_MESSAGES)
  const [isListening, setIsListening] = useState(false)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [isMuted, setIsMuted]         = useState(false)
  const [isPaused, setIsPaused]       = useState(false)
  const [currentChapter, setCurrentChapter] = useState(0)
  const [textInput, setTextInput]     = useState("")
  const scrollRef                     = useRef<HTMLDivElement>(null)
  const responseIdx                   = useRef(0)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleMicToggle = () => {
    if (isListening) {
      // Simulate user finished speaking
      setIsListening(false)
      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        text: "Can you explain the key concepts from Chapter 2?",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((p) => [...p, userMsg])
      // Simulate AI thinking then responding
      setTimeout(() => {
        setIsAISpeaking(true)
        const aiMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: AI_RESPONSES[responseIdx.current % AI_RESPONSES.length],
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }
        responseIdx.current++
        setMessages((p) => [...p, aiMsg])
        setTimeout(() => setIsAISpeaking(false), 4000)
      }, 1200)
    } else {
      setIsListening(true)
    }
  }

  const handleTextSend = () => {
    if (!textInput.trim()) return
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: textInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    setMessages((p) => [...p, userMsg])
    setTextInput("")
    setTimeout(() => {
      setIsAISpeaking(true)
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: AI_RESPONSES[responseIdx.current % AI_RESPONSES.length],
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      responseIdx.current++
      setMessages((p) => [...p, aiMsg])
      setTimeout(() => setIsAISpeaking(false), 3500)
    }, 900)
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col md:flex-row overflow-hidden">

      {/* ─── LEFT PANEL: Book Info ─────────────────────── */}
      <aside className="hidden md:flex md:w-80 lg:w-96 flex-col border-r border-border/40 bg-card/50 shrink-0">

        {/* Book header */}
        <div className="p-5 border-b border-border/40">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
            id="chat-back-link"
          >
            <ArrowLeft className="h-3 w-3" /> Back to Library
          </Link>

          <div className="flex gap-4 items-start">
            {/* Mini book cover */}
            <div className="flex-shrink-0 w-14 h-20 rounded-md bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center relative">
              <BookOpen className="h-6 w-6 text-amber-200/50" />
              <div className="absolute left-0 inset-y-0 w-1.5 bg-amber-950 rounded-l-sm" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-base leading-snug">{MOCK_BOOK.title}</h1>
              <p className="text-xs text-muted-foreground mt-0.5">{MOCK_BOOK.author}</p>
              <Badge
                variant="outline"
                className="mt-2 text-xs border-amber-500/30 text-amber-500"
              >
                In session
              </Badge>
            </div>
          </div>
        </div>

        {/* Chapter navigation */}
        <div className="p-5 flex-1 overflow-auto">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Chapters
          </h2>
          <nav className="space-y-1" aria-label="Chapter navigation">
            {MOCK_BOOK.chapters.map((ch, i) => (
              <button
                key={i}
                id={`chapter-btn-${i}`}
                onClick={() => setCurrentChapter(i)}
                className={cn(
                  "w-full text-left text-sm px-3 py-2 rounded-lg transition-colors",
                  currentChapter === i
                    ? "bg-amber-500/15 text-amber-500 font-medium"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <span className="text-xs mr-2 opacity-50">{i + 1}.</span>
                {ch}
              </button>
            ))}
          </nav>
        </div>

        {/* Chapter navigation arrows */}
        <div className="p-4 border-t border-border/40 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            id="prev-chapter-btn"
            onClick={() => setCurrentChapter((p) => Math.max(0, p - 1))}
            disabled={currentChapter === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <span className="text-xs text-muted-foreground">
            Ch. {currentChapter + 1} / {MOCK_BOOK.chapters.length}
          </span>
          <Button
            variant="ghost"
            size="sm"
            id="next-chapter-btn"
            onClick={() => setCurrentChapter((p) => Math.min(MOCK_BOOK.chapters.length - 1, p + 1))}
            disabled={currentChapter === MOCK_BOOK.chapters.length - 1}
            className="gap-1"
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </aside>

      {/* ─── RIGHT PANEL: Voice Chat ───────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Chat header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border/40 bg-background/80 backdrop-blur shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-amber-500/20 text-amber-500 text-sm font-semibold">
                  AI
                </AvatarFallback>
              </Avatar>
              {isAISpeaking && (
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-amber-500 border-2 border-background animate-pulse" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">TalkBook AI</p>
              <p className="text-xs text-muted-foreground">
                {isAISpeaking
                  ? "Speaking…"
                  : isListening
                  ? "Listening…"
                  : "Ready to talk"}
              </p>
            </div>
          </div>

          {/* Session controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              id="chat-mute-btn"
              onClick={() => setIsMuted(!isMuted)}
              className="h-8 w-8 rounded-full"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              id="chat-pause-btn"
              onClick={() => setIsPaused(!isPaused)}
              className="h-8 w-8 rounded-full"
              aria-label={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              id="chat-reset-btn"
              onClick={() => { setMessages(INITIAL_MESSAGES); responseIdx.current = 0 }}
              className="h-8 w-8 rounded-full"
              aria-label="Reset conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Separator orientation="vertical" className="h-5 mx-1" />
            <Link href="/" id="end-session-btn">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <PhoneOff className="h-4 w-4" />
                <span className="hidden sm:inline">End Session</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* AI Avatar + Waveform */}
        <div className="px-4 md:px-6 py-5 flex flex-col items-center gap-4 border-b border-border/20 shrink-0">
          <div className="relative">
            <div
              className={cn(
                "flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500",
                isAISpeaking
                  ? "bg-amber-500/20 animate-pulse-glow"
                  : isListening
                  ? "bg-blue-500/20"
                  : "bg-muted"
              )}
            >
              <span className="text-2xl font-bold text-amber-500 select-none">AI</span>
            </div>
          </div>
          <VoiceWaveform
            isActive={isAISpeaking}
            barCount={18}
            color="amber"
            className="h-10"
          />
          <p className="text-xs text-muted-foreground">
            {isAISpeaking ? "AI is speaking" : isListening ? "Listening to you…" : "Tap mic to speak"}
          </p>
        </div>

        {/* Transcript */}
        <ScrollArea className="flex-1 px-4 md:px-6" id="chat-transcript">
          <div ref={scrollRef} className="py-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex gap-3 items-start",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className={cn(
                      "text-xs font-semibold",
                      msg.role === "ai"
                        ? "bg-amber-500/20 text-amber-500"
                        : "bg-primary/20 text-primary"
                    )}
                  >
                    {msg.role === "ai" ? "AI" : "You"}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "max-w-[75%] space-y-1",
                    msg.role === "user" ? "items-end" : "items-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                      msg.role === "ai"
                        ? "bg-card border border-border/50 rounded-tl-sm"
                        : "bg-amber-500 text-white rounded-tr-sm"
                    )}
                  >
                    {msg.text}
                  </div>
                  <p className="text-[10px] text-muted-foreground px-1">{msg.time}</p>
                </div>
              </div>
            ))}
            {/* Typing indicator */}
            {isListening && (
              <div className="flex gap-3 items-start flex-row-reverse">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs font-semibold bg-primary/20 text-primary">You</AvatarFallback>
                </Avatar>
                <div className="bg-amber-500 rounded-2xl rounded-tr-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    <VoiceWaveform isActive barCount={6} color="amber" className="h-4 [&>span]:bg-white" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Bottom controls */}
        <div className="px-4 md:px-6 py-4 border-t border-border/40 bg-background/80 backdrop-blur shrink-0">
          {/* Text input */}
          <div className="flex gap-2 mb-3">
            <input
              id="chat-text-input"
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleTextSend()}
              placeholder="Type a message or use the mic…"
              className="flex-1 bg-muted/50 border border-border/50 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all placeholder:text-muted-foreground"
            />
            <Button
              id="chat-send-btn"
              onClick={handleTextSend}
              disabled={!textInput.trim()}
              size="icon"
              className="bg-amber-500 hover:bg-amber-600 text-white border-0 rounded-xl"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          {/* Mic button */}
          <div className="flex justify-center">
            <button
              id="mic-btn"
              onClick={handleMicToggle}
              aria-label={isListening ? "Stop listening" : "Start speaking"}
              className={cn(
                "flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500",
                isListening
                  ? "bg-red-500 shadow-lg shadow-red-500/40 scale-110 animate-pulse-glow"
                  : "bg-amber-500/10 hover:bg-amber-500/20 border-2 border-amber-500/30 hover:border-amber-500"
              )}
            >
              {isListening ? (
                <MicOff className="h-7 w-7 text-white" />
              ) : (
                <Mic className="h-7 w-7 text-amber-500" />
              )}
            </button>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-2">
            {isListening ? "Tap to stop" : "Tap to speak"}
          </p>
        </div>
      </div>
    </div>
  )
}
