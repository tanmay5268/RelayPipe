"use client";

import { useEffect, useState } from "react";
import { useAuth, SignUpButton, UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { LogoMark } from "./Logo";
import { ArrowRight } from "@phosphor-icons/react";

const links = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#features", label: "Features" },
  { href: "#api", label: "API" },
];

export default function Navbar() {
  const { isSignedIn } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/80 bg-background/80 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          <LogoMark />
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "size-9 rounded-full ring-2 ring-primary/40",
                },
              }}
            />
          ) : (
            <SignUpButton mode="modal">
              <button className="group inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-12px_color-mix(in_oklch,var(--primary)_70%,transparent)] transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_10px_28px_-10px_color-mix(in_oklch,var(--primary)_85%,transparent)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
                Sign in
                <ArrowRight
                  weight="bold"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </button>
            </SignUpButton>
          )}
        </div>
      </nav>
    </header>
  );
}