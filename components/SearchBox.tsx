"use client"

import { Search, X } from "lucide-react"
import { Input as ShadcnInput } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SearchBoxProps {
  onSearch?: (query: string) => void
  className?: string
  placeholder?: string
}

export function SearchBox({ onSearch, className, placeholder = "Search for books, authors, or topics..." }: SearchBoxProps) {
  const [query, setQuery] = useState("")

  const handleClear = () => {
    setQuery("")
    onSearch?.("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
    onSearch?.(val)
  }

  return (
    <div className={cn("relative group w-full", className)}>
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-amber-500 transition-colors">
        <Search className="h-4 w-4" />
      </div>
      <ShadcnInput
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
        className="h-12 pl-10 pr-10 bg-card/50 border-border/50 hover:border-amber-500/30 focus:border-amber-500/50 focus:ring-amber-500/10 rounded-xl transition-all shadow-sm"
      />
      {query && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-muted text-muted-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}