import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { MotionConfig } from "framer-motion";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { ToastProvider } from "@/components/ui/toast-context";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RelayPipe — Watch your files move through a live pipeline",
  description:
    "Upload a file and watch it flow through a real processing pipeline — queued, processed, delivered, live on screen. No black boxes, no guessing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "dark",
        spaceGrotesk.variable,
        inter.variable,
        jetbrainsMono.variable,
      )}
    >
      <body className="font-sans">
        <ToastProvider>
          <ClerkProvider>
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
          </ClerkProvider>
        </ToastProvider>
      </body>
    </html>
  );
}