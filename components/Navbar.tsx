"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

const NAV_ITEMS = [
  { label: "Library",  href: "/" },
  { label: "Add New",  href: "/books/new" },
  { label: "Pricing",  href: "/pricing" },
  { label: "About",    href: "/about" },
]

export const Navbar = () => {
  const pathName        = usePathname()
  const [open, setOpen] = useState(false)
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const logoSrc = !mounted
    ? "/TalkBook-dark.png" // default to dark if not mounted to avoid flicker on dark-default apps
    : resolvedTheme === "dark"
    ? "/TalkBook-dark.png"
    : "/TalkBook-light.png"

  return (
    <header className="w-full fixed top-0 z-50 border-b border-border/40 bg-background shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" id="nav-logo">
          <div className="relative h-10 w-36">
            <Image
              src={logoSrc}
              alt="TalkBook Logo"
              fill
              className="object-contain object-left transition-opacity duration-300"
              priority
            />
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = pathName === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                id={`nav-${item.label.toLowerCase().replace(" ", "-")}`}
                className={cn(
                  "relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "text-amber-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 bg-amber-500 rounded-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Show when="signed-out">
            <div className="hidden md:flex items-center gap-2">
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm" id="nav-signin-btn" className="cursor-pointer">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  size="sm"
                  id="nav-signup-btn"
                  className="bg-amber-500 hover:bg-amber-600 text-white border-0 cursor-pointer"
                >
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          </Show>

          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 ring-2 ring-amber-500/30",
                },
              }}
            />
          </Show>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-muted/60 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            id="nav-mobile-menu-btn"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md px-4 py-4 space-y-1 animate-fade-up">
          {NAV_ITEMS.map((item) => {
            const isActive = pathName === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "text-amber-500 bg-amber-500/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {item.label}
              </Link>
            )
          })}
          <Show when="signed-out">
            <div className="flex gap-2 pt-2">
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="flex-1">Sign in</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button size="sm" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white border-0">
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          </Show>
        </div>
      )}
    </header>
  )
}
