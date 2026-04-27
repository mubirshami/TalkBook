"use client"

import { useState, useMemo } from "react"
import { BookCard } from "@/components/BookCard"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Mic, Sparkles, ArrowRight, Upload } from "lucide-react"
import Link from "next/link"
import { Show } from "@clerk/nextjs"
import { SearchBox } from "@/components/SearchBox"

/* ── Mock data (replace with DB fetch) ─────────────────── */
const MOCK_BOOKS = [
  { id: "1", title: "Atomic Habits", author: "James Clear", sessions: 4, lastRead: "2d ago", coverImage: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop" },
  { id: "2", title: "The Great Gatsby", author: "F. Scott Fitzgerald", sessions: 1, lastRead: "1w ago" },
  { id: "3", title: "Thinking, Fast and Slow", author: "Daniel Kahneman", sessions: 7, lastRead: "3d ago" },
  { id: "4", title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", sessions: 2, lastRead: "5d ago" },
  { id: "5", title: "The Lean Startup", author: "Eric Ries", sessions: 3, lastRead: "1d ago" },
  { id: "6", title: "Deep Work", author: "Cal Newport", sessions: 0, lastRead: undefined },
]

const FEATURES = [
  {
    icon: Upload,
    title: "Upload Any PDF",
    description: "Drag and drop your books, textbooks, or any PDF document in seconds.",
  },
  {
    icon: Mic,
    title: "Voice Conversations",
    description: "Have natural voice dialogues — ask questions, explore themes, get summaries.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Insights",
    description: "Get deep contextual answers grounded in your book's actual content.",
  },
]

export default function HomePage() {
  return (
    <>
      {/* ── Signed Out: Landing Hero ──────────────────────── */}
      <Show when="signed-out">
        <LandingHero />
      </Show>

      {/* ── Signed In: Library ───────────────────────────── */}
      <Show when="signed-in">
        <LibraryPage />
      </Show>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   LANDING HERO
═══════════════════════════════════════════════════════════ */
function LandingHero() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Ambient gradient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-amber-400/6 blur-[100px]" />
      </div>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 max-w-4xl mx-auto w-full">
        <Badge
          variant="outline"
          className="mb-6 gap-1.5 border-amber-500/30 text-amber-500 bg-amber-500/10 animate-fade-up"
          id="hero-badge"
        >
          <Sparkles className="h-3 w-3" />
          AI-Powered Reading
        </Badge>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] animate-fade-up delay-100">
          Your Books,{" "}
          <span className="text-amber-500">
            Now Speak Back
          </span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl animate-fade-up delay-200">
          Upload any PDF and have a real-time voice conversation with your book.
          TalkBook uses AI to answer questions, summarise chapters, and explore
          ideas — all grounded in your book's content.
        </p>

        <div className="mt-10 flex flex-wrap gap-3 justify-center animate-fade-up delay-300">
          <Link href="/books/new" id="hero-upload-cta">
            <Button
              size="lg"
              className="gap-2 bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-shadow"
            >
              <Upload className="h-4 w-4" />
              Upload a Book
            </Button>
          </Link>
          <Link href="#how-it-works" id="hero-learn-more">
            <Button size="lg" variant="outline" className="gap-2 border-border/60">
              How it works <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Floating book illustration */}
        <div
          aria-hidden="true"
          className="mt-20 animate-float"
        >
          <div className="relative mx-auto w-48 h-60">
            {/* Book pages */}
            <div className="absolute inset-0 rounded-r-lg bg-gradient-to-br from-amber-800 to-amber-950 shadow-2xl shadow-amber-900/40" />
            <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 rounded-r-lg bg-gradient-to-br from-amber-700 to-amber-900" />
            <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-r-lg bg-gradient-to-br from-amber-600 to-amber-800" />
            {/* Spine */}
            <div className="absolute left-0 inset-y-3 w-3 rounded-l-sm bg-amber-950 z-10" />
            {/* Cover icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20">
              <BookOpen className="h-12 w-12 text-amber-200/60" />
              <div className="h-0.5 w-16 bg-amber-200/30 rounded-full" />
              <div className="h-0.5 w-12 bg-amber-200/20 rounded-full" />
            </div>
            {/* Voice indicator */}
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-30">
              {[14, 22, 18, 26, 16].map((h, i) => (
                <span
                  key={i}
                  className="w-1.5 rounded-full bg-amber-400 animate-wave"
                  style={{
                    height: `${h}px`,
                    animationDelay: `${i * 100}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-24 px-4 border-t border-border/40"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-muted-foreground text-center mb-14 max-w-xl mx-auto">
            Three simple steps to transform any PDF into an interactive AI conversation.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="flex flex-col items-center text-center gap-4 p-6 rounded-2xl border border-border/50 bg-card hover:border-amber-500/30 transition-all duration-300 hover:shadow-md hover:shadow-amber-500/5"
                id={`feature-card-${i + 1}`}
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10">
                  <f.icon className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{f.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center rounded-3xl border border-amber-500/20 bg-amber-500/5 p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to talk to your books?</h2>
          <p className="text-muted-foreground mb-8">
            Upload your first PDF and start a conversation in under a minute.
          </p>
          <Link href="/books/new" id="cta-bottom-btn">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg shadow-amber-500/25"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   LIBRARY PAGE (authenticated)
═══════════════════════════════════════════════════════════ */
function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBooks = useMemo(() => {
    return MOCK_BOOKS.filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold">My Library</h1>
            <p className="text-muted-foreground mt-1">
              {MOCK_BOOKS.length} book{MOCK_BOOKS.length !== 1 ? "s" : ""} · click any to start talking
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-md md:justify-end">
            <SearchBox onSearch={setSearchQuery} className="w-full" />
          </div>
        </div>

        {MOCK_BOOKS.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="h-20 w-20 rounded-2xl bg-amber-500/10 flex items-center justify-center mb-6">
              <BookOpen className="h-10 w-10 text-amber-500/60" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No books yet</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Upload your first PDF to start having AI-powered voice conversations with your books.
            </p>
            <Link href="/books/new">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white border-0">
                Upload Your First Book
              </Button>
            </Link>
          </div>
        ) : (
          /* Book grid */
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-start">

            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <BookCard key={book.id} {...book} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <p className="text-muted-foreground text-lg">No books found matching "{searchQuery}"</p>
                <Button 
                  variant="ghost" 
                  onClick={() => setSearchQuery("")}
                  className="mt-2 text-amber-500 hover:text-amber-600 hover:bg-amber-500/5"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}