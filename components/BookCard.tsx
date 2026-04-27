"use client"

import { cn } from "@/lib/utils"
import { BookOpen, Clock, MessageCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

interface BookCardProps {
  id: string
  title: string
  author: string
  sessions: number
  lastRead?: string
  coverColor?: string
  className?: string
}

const COVER_COLORS = [
  "from-amber-700 to-amber-900",
  "from-teal-700 to-teal-900",
  "from-rose-700 to-rose-900",
  "from-indigo-700 to-indigo-900",
  "from-emerald-700 to-emerald-900",
  "from-purple-700 to-purple-900",
]

export function BookCard({
  id,
  title,
  author,
  sessions,
  lastRead,
  coverColor,
  className,
}: BookCardProps) {
  // deterministic color from title
  const colorClass =
    coverColor ??
    COVER_COLORS[title.charCodeAt(0) % COVER_COLORS.length]

  return (
    <Link href={`/books/${id}/chat`} className="group block">
      <Card
        className={cn(
          "overflow-hidden border-border/50 bg-card hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1",
          className
        )}
      >
        {/* Book cover */}
        <div
          className={cn(
            "relative h-44 bg-gradient-to-br flex items-center justify-center",
            colorClass
          )}
        >
          <BookOpen className="w-12 h-12 text-white/30 group-hover:text-white/50 transition-colors duration-300" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
          {/* Spine line */}
          <div className="absolute left-4 inset-y-0 w-[2px] bg-black/20 rounded-full" />
        </div>

        <CardContent className="p-4 space-y-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2 group-hover:text-amber-500 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-muted-foreground">{author}</p>
          <div className="flex items-center justify-between pt-1">
            <Badge
              variant="secondary"
              className="text-xs gap-1 flex items-center"
            >
              <MessageCircle className="w-3 h-3" />
              {sessions} session{sessions !== 1 ? "s" : ""}
            </Badge>
            {lastRead && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {lastRead}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
