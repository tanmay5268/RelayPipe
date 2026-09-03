"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { Reveal } from "./Reveal";

function CountUp({
  to,
  suffix = "",
  duration = 1.4,
}: {
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {value}
      {suffix}
    </span>
  );
}

const stats = [
  { to: 3, suffix: "", label: "stages every file passes" },
  { to: 4, suffix: "", label: "file types supported" },
  { to: 50, suffix: " MB", label: "max file size per upload" },
  { to: 100, suffix: "%", label: "live visibility — nothing hidden" },
];

export default function Stats() {
  return (
    <section className="relative mx-auto max-w-6xl px-4 sm:px-6">
      <Reveal>
        <dl className="grid grid-cols-2 overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={
                "flex flex-col items-center gap-1.5 px-4 py-8 text-center sm:py-10 " +
                (i > 0 ? "border-t border-border lg:border-t-0 lg:border-l" : "") +
                (i === 2 ? "border-t border-border lg:border-t-0" : "")
              }
            >
              <dd className="bg-gradient-to-b from-primary to-[#FFB45C] bg-clip-text font-display text-4xl font-semibold tracking-tight text-transparent sm:text-5xl">
                <CountUp to={stat.to} suffix={stat.suffix} />
              </dd>
              <dt className="text-center font-mono text-[11px] tracking-wide text-muted-foreground uppercase sm:text-xs">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  );
}