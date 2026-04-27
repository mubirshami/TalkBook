"use client"

import { cn } from "@/lib/utils"

interface VoiceWaveformProps {
  isActive: boolean
  className?: string
  barCount?: number
  color?: "amber" | "blue" | "green"
}

export function VoiceWaveform({
  isActive,
  className,
  barCount = 12,
  color = "amber",
}: VoiceWaveformProps) {
  const colorMap = {
    amber: "bg-amber-400",
    blue: "bg-blue-400",
    green: "bg-emerald-400",
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-[3px]",
        className
      )}
      aria-label={isActive ? "Speaking" : "Idle"}
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "block w-[3px] rounded-full transition-all",
            colorMap[color],
            isActive
              ? "animate-[wave_1s_ease-in-out_infinite]"
              : "h-[4px] opacity-40"
          )}
          style={
            isActive
              ? {
                  animationDelay: `${(i * 80) % 600}ms`,
                  height: `${12 + ((i * 7) % 24)}px`,
                }
              : undefined
          }
        />
      ))}
    </div>
  )
}
