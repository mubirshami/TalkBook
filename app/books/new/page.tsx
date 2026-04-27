"use client"

import { useState } from "react"
import { UploadDropzone } from "@/components/UploadDropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Loader2, Tag, X } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const STEPS = [
  { id: 1, label: "Upload PDF" },
  { id: 2, label: "Book Details" },
  { id: 3, label: "Processing" },
]

export default function NewBookPage() {
  const [step, setStep]           = useState(1)
  const [file, setFile]           = useState<File | null>(null)
  const [title, setTitle]         = useState("")
  const [author, setAuthor]       = useState("")
  const [description, setDescription] = useState("")
  const [tagInput, setTagInput]   = useState("")
  const [tags, setTags]           = useState<string[]>([])
  const [progress, setProgress]   = useState(0)
  const [done, setDone]           = useState(false)

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags((p) => [...p, t])
    setTagInput("")
  }

  const simulateProcessing = () => {
    setStep(3)
    let val = 0
    const iv = setInterval(() => {
      val += Math.random() * 15
      if (val >= 100) {
        clearInterval(iv)
        setProgress(100)
        setTimeout(() => setDone(true), 400)
      } else {
        setProgress(val)
      }
    }, 350)
  }

  return (
    <div className="min-h-screen px-4 py-10">

      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 bg-amber-500/6 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-2xl mx-auto">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          id="new-book-back-link"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Library
        </Link>

        <h1 className="text-3xl font-bold mb-1">Add New Book</h1>
        <p className="text-muted-foreground mb-8">
          Upload a PDF and give your book some details so TalkBook can personalise your experience.
        </p>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10" aria-label="Step progress">
          {STEPS.map((s, idx) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                  step > s.id
                    ? "bg-amber-500 text-white"
                    : step === s.id
                    ? "bg-amber-500/20 text-amber-500 ring-2 ring-amber-500"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step > s.id ? <CheckCircle2 className="h-4 w-4" /> : s.id}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block",
                  step === s.id ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {s.label}
              </span>
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-px flex-1 transition-colors",
                    step > s.id ? "bg-amber-500" : "bg-border"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Step 1: Upload ─────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-up">
            <UploadDropzone
              onFileSelect={(f) => {
                setFile(f)
                if (!title) setTitle(f.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " "))
              }}
            />
            <Button
              id="upload-next-btn"
              onClick={() => setStep(2)}
              disabled={!file}
              className="w-full gap-2 bg-amber-500 hover:bg-amber-600 text-white border-0"
            >
              Continue to Details <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* ── Step 2: Metadata ───────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-up">
            <div className="rounded-2xl border border-border/50 bg-card p-6 space-y-5">

              <div className="space-y-2">
                <label htmlFor="book-title" className="text-sm font-medium">
                  Book Title <span className="text-destructive">*</span>
                </label>
                <Input
                  id="book-title"
                  placeholder="e.g. Atomic Habits"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="book-author" className="text-sm font-medium">Author</label>
                <Input
                  id="book-author"
                  placeholder="e.g. James Clear"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="book-description" className="text-sm font-medium">Short description</label>
                <Textarea
                  id="book-description"
                  placeholder="What is this book about?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background/50 resize-none"
                  rows={3}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <label htmlFor="book-tags" className="text-sm font-medium flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" /> Tags
                </label>
                <div className="flex gap-2">
                  <Input
                    id="book-tags"
                    placeholder="Add a tag…"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    className="bg-background/50"
                  />
                  <Button variant="outline" onClick={addTag} id="add-tag-btn">Add</Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 cursor-pointer"
                        onClick={() => setTags((p) => p.filter((t) => t !== tag))}
                      >
                        {tag}
                        <X className="h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                id="details-back-btn"
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <Button
                id="details-process-btn"
                onClick={simulateProcessing}
                disabled={!title.trim()}
                className="flex-2 flex-1 gap-2 bg-amber-500 hover:bg-amber-600 text-white border-0"
              >
                Process Book <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ── Step 3: Processing ─────────────────────────── */}
        {step === 3 && (
          <div className="text-center space-y-8 py-8 animate-fade-up">
            {!done ? (
              <>
                <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-2xl bg-amber-500/10">
                  <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold mb-1">Processing your book…</h2>
                  <p className="text-sm text-muted-foreground">
                    TalkBook is reading and indexing your PDF.
                  </p>
                </div>
                <div className="space-y-2 text-left">
                  <Progress value={progress} className="h-2" id="processing-progress" />
                  <p className="text-xs text-muted-foreground text-right">
                    {Math.round(progress)}%
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                  {["Parsing PDF", "Chunking text", "Building index"].map((label, i) => (
                    <div
                      key={label}
                      className={cn(
                        "rounded-lg border border-border/50 p-3 transition-colors",
                        progress > i * 33 + 10 ? "border-amber-500/30 bg-amber-500/5 text-amber-500" : ""
                      )}
                    >
                      {progress > i * 33 + 10 ? (
                        <CheckCircle2 className="h-4 w-4 mx-auto mb-1" />
                      ) : (
                        <div className="h-4 w-4 mx-auto mb-1 rounded-full border border-current" />
                      )}
                      {label}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-amber-500/10 animate-pulse-glow">
                  <BookOpen className="h-10 w-10 text-amber-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-2">Your book is ready! 🎉</h2>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">{title}</strong> has been processed successfully.
                    Start talking to it now!
                  </p>
                </div>
                <Link href="/books/1/chat" id="start-chat-btn">
                  <Button className="gap-2 bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-lg shadow-amber-500/20">
                    Start Talking to Your Book
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
