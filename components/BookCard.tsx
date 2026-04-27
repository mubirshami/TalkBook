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
  coverImage?: string 
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
  coverImage,
  className,
}: BookCardProps) {
  const colorClass =
    coverColor ??
    COVER_COLORS[title.charCodeAt(0) % COVER_COLORS.length]

  return (
    <Link href={`/books/${id}/chat`} className="group block">
      <Card
        className={cn(
          "flex flex-col h-[330px] overflow-hidden border-border/50 bg-card hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1",
          className
        )}
      >
        {/* Book cover */}
        <div
          className={cn(
            "relative h-40 shrink-0 w-full flex items-center justify-center overflow-hidden",
            !coverImage && "bg-gradient-to-br",
            !coverImage && colorClass
          )}
        >
          {coverImage ? (
            <img
              src={coverImage}
              alt={`Cover of ${title}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <>
              <BookOpen className="w-12 h-12 text-white/30 group-hover:text-white/50 transition-colors duration-300" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
              {/* Spine line */}
              <div className="absolute left-4 inset-y-0 w-[2px] bg-black/20 rounded-full z-10" />
            </>
          )}
        </div>

        <CardContent className="p-4 flex-1 flex flex-col justify-between overflow-hidden">
          <div className="space-y-1.5">
            <h3 
              className="truncate font-semibold text-sm leading-tight line-clamp-2 group-hover:text-amber-500 transition-colors"
              title={title}
            >
              {title}
            </h3>
            <p className="text-xs text-muted-foreground truncate" title={author}>
              {author}
            </p>
          </div>
          
          <div className="flex items-center justify-between pt-2 mt-auto border-t border-border/40">
            <Badge
              variant="secondary"
              className="text-[10px] sm:text-xs gap-1 flex items-center bg-secondary/50 shrink-0"
            >
              <MessageCircle className="w-3 h-3 shrink-0" />
              <span className="truncate max-w-[60px] sm:max-w-none">{sessions} session{sessions !== 1 ? "s" : ""}</span>
            </Badge>
            {lastRead && (
              <span className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-1 shrink-0 ml-2">
                <Clock className="w-3 h-3 shrink-0" />
                <span className="truncate">{lastRead}</span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}