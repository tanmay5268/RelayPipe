import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { LogoMark } from "@/components/HomePage/Logo";
import { cn } from "@/lib/utils";

export function AppHeader({
  active,
  links,
}: {
  active?: string;
  links?: { href: string; label: string }[];
}) {
  return (
    <header className="relative z-20 border-b border-border/70 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="rounded-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <LogoMark />
        </Link>

        {links && links.length > 0 && (
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  active === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-9 rounded-full ring-2 ring-primary/40",
            },
          }}
        />
      </div>
    </header>
  );
}