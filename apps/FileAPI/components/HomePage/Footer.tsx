import Link from "next/link";
import { LogoMark } from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:flex-row sm:px-6">
        <LogoMark />
        <p className="font-mono text-xs text-muted-foreground">
          file processing pipeline · live on screen
        </p>
        <nav className="flex items-center gap-6">
          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </a>
          <a
            href="#features"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Features
          </a>
          <Link
            href="/api"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            API docs
          </Link>
        </nav>
      </div>
      <div className="border-t border-border/60 py-4 text-center font-mono text-[11px] text-muted-foreground/70">
        © {new Date().getFullYear()} RelayPipe — every file tells its own story
      </div>
    </footer>
  );
}