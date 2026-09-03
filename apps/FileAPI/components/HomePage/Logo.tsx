import icon from "@/app/icon.svg";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 rounded-full shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_30%,transparent),0_0_24px_-4px_color-mix(in_oklch,var(--primary)_55%,transparent)]",
        className,
      )}
    >
      <Image
        src={icon}
        alt=""
        aria-hidden
        width={32}
        height={32}
        className="size-full rounded-full"
      />
    </span>
  );
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Logo className="size-8" />
      <span className="font-display text-lg font-semibold tracking-tight text-foreground">
        RelayPipe
      </span>
    </span>
  );
}