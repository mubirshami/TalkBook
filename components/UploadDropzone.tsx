"use client"

import { cn } from "@/lib/utils"
import { FileText, UploadCloud } from "lucide-react"
import { useRef, useState, useCallback } from "react"

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void
  className?: string
}

export function UploadDropzone({ onFileSelect, className }: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== "application/pdf") return
      setSelectedFile(file)
      onFileSelect(file)
    },
    [onFileSelect]
  )

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      id="upload-dropzone"
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-12 cursor-pointer transition-all duration-300",
        isDragging
          ? "border-amber-500 bg-amber-500/5 scale-[1.01]"
          : selectedFile
          ? "border-emerald-500/60 bg-emerald-500/5"
          : "border-border hover:border-amber-500/50 hover:bg-amber-500/5",
        className
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      aria-label="Upload PDF dropzone"
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={handleChange}
        id="pdf-file-input"
      />

      <div
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-2xl transition-colors duration-300",
          selectedFile ? "bg-emerald-500/15" : "bg-amber-500/10"
        )}
      >
        {selectedFile ? (
          <FileText className="h-8 w-8 text-emerald-400" />
        ) : (
          <UploadCloud
            className={cn(
              "h-8 w-8 transition-transform duration-300",
              isDragging ? "text-amber-400 -translate-y-1" : "text-amber-500/70"
            )}
          />
        )}
      </div>

      {selectedFile ? (
        <div className="text-center">
          <p className="font-semibold text-emerald-400">{selectedFile.name}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Click to change
          </p>
        </div>
      ) : (
        <div className="text-center space-y-1">
          <p className="font-semibold text-foreground">
            Drop your PDF here
          </p>
          <p className="text-sm text-muted-foreground">
            or <span className="text-amber-500 underline underline-offset-2">browse files</span>
          </p>
          <p className="text-xs text-muted-foreground pt-1">PDF only · max 50 MB</p>
        </div>
      )}
    </div>
  )
}
