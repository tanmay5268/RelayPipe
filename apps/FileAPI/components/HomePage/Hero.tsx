"use client";
import { useAuth } from "@clerk/nextjs";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SignUpButton, UserButton } from "@clerk/nextjs";
import { useToast } from "@/components/ui/toast-context";
import { registerUser } from "@/actions";
import icon from "@/app/icon.svg"
import Image from "next/image";

const LogoIcon: React.FC = () => (
  <Image src={icon} alt="RelayPipe logo" width="35" height="35" />
);

const MenuIcon: React.FC = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 12h16m-7 6h7"
    />
  </svg>
);

const CloseIcon: React.FC = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

export default function Hero2() {
  const { isSignedIn } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleSeeHowItWorks = async (direct: string) => {
    if (!isSignedIn) {
      showToast(
        "warning",
        "Please sign in first",
        "You need to be logged in to see how it works",
        5000,
      );
      return;
    }
    await registerUser();
    router.push(direct);
  };

  const handleApiPlayground = () => {
    if (!isSignedIn) {
      showToast(
        "warning",
        "Please sign in first",
        "You need to be logged in to access the API Playground",
        5000,
      );
      return;
    }
    router.push("/api");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#2A2A2A]">
      {/*<div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-[40rem] h-[40rem] bg-gradient-to-tr from-orange-200 dark:from-orange-800/30 to-transparent opacity-20 dark:opacity-10 rounded-full blur-3xl" />
      </div>*/}
      {/*<div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 pointer-events-none">
        <div className="w-[40rem] h-[40rem] bg-gradient-to-bl from-orange-200 dark:from-orange-800/30 to-transparent opacity-20 dark:opacity-10 rounded-full blur-3xl" />
      </div>*/}

      <header className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <LogoIcon />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                RelayPipe
              </span>
            </div>
            <div className="">
              {!isSignedIn ? (
                <SignUpButton>
                  <button className="px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 text-white bg-orange-500">
                    Sign In
                  </button>
                </SignUpButton>
              ) : (
                <UserButton />
              )}
              
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="relative z-10 text-center py-16 sm:py-15 px-4">
          <div className="max-w-4xl mx-auto">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-orange-600 dark:text-orange-400 uppercase bg-orange-100 dark:bg-orange-900/30 rounded-full">
              Live File PipeLine
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
              <span className="hover:text-orange-500 duration-700 transition-all ease-in-out">
                Upload
              </span>{" "}
              it.{" "}
              <span className="hover:text-orange-500 transition-all ease-in-out duration-700">
                Watch
              </span>{" "}
              it move. No guessing what happens next.
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 transition-all ease-in-out dark:text-gray-300">
              Sign in, upload a file, and watch it move through a real
              processing pipeline — queued, processed, and delivered, step by
              step, live on screen.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus:ring-gray-900 dark:focus:ring-gray-300 px-5 py-2.5 rounded-lg w-full sm:w-auto font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105"
                onClick={() => {
                  handleSeeHowItWorks("/project");
                }}
              >
                See how it works
              </button>
              <button
                className="dark:bg-orange-500 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-orange-200 focus:ring-gray-900 dark:focus:ring-gray-300 px-5 py-2.5 rounded-lg w-full sm:w-auto font-semibold text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105"
                onClick={handleApiPlayground}
              >
                API Docs
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
