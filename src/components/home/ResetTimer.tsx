"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TOTAL_SECONDS = 15 * 60;
/** Atmosphere reaches full Lavender/Mint after this many elapsed seconds, then holds. */
const ATMOSPHERE_RAMP_SECONDS = 180;

const REVEAL_LINES = ["ĐẶT ĐIỆN THOẠI XUỐNG.", "ĐẮP MẶT NẠ.", "TẮT THẾ GIỚI BÊN NGOÀI."];
/** ms after start — sequential reveal, then a fade-out so the timer becomes dominant again. */
const REVEAL_DELAYS_MS = [900, 3400, 6200];
const REVEAL_FADE_OUT_MS = 10500;

const AMBIENT_OPTIONS = ["NHẠC NHẸ", "MƯA", "ĐẠI DƯƠNG", "RỪNG"];

type Status = "idle" | "running" | "paused" | "completed";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const PRIMARY_BUTTON =
  "flex min-h-11 items-center bg-charcoal px-8 text-xs font-medium tracking-[0.14em] text-cloud-milk transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-purple";
const SECONDARY_BUTTON =
  "flex min-h-11 items-center border border-charcoal px-8 text-xs font-medium tracking-[0.14em] text-charcoal transition-colors duration-200 hover:bg-charcoal hover:text-cloud-milk";
const TEXT_BUTTON =
  "flex min-h-11 items-center px-3 text-xs font-medium tracking-[0.12em] text-charcoal/70 underline underline-offset-4 transition-colors hover:text-charcoal";

/**
 * Full atmospheric section: a real countdown (setInterval, tab-safe via
 * clearInterval on pause/reset/unmount) drives everything else. Progress
 * through the first few minutes fades in an overlay wash toward
 * Lavender/Mint and reveals three lines in sequence before letting them
 * fade so the timer becomes dominant again — see CLAUDE.md > Phase 5 RESET
 * TIMER. No gamification (confetti/points/badges) per that spec.
 */
export function ResetTimer() {
  const [status, setStatus] = useState<Status>("idle");
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [revealStep, setRevealStep] = useState(0);
  const [ambient, setAmbient] = useState<string | null>(null);

  const intervalRef = useRef<number | null>(null);
  const revealTimeouts = useRef<number[]>([]);

  const elapsed = TOTAL_SECONDS - remaining;
  const atmosphere = Math.min(elapsed / ATMOSPHERE_RAMP_SECONDS, 1);

  useEffect(() => {
    if (status !== "running") return;
    intervalRef.current = window.setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current != null) window.clearInterval(intervalRef.current);
          setStatus("completed");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current != null) window.clearInterval(intervalRef.current);
    };
  }, [status]);

  useEffect(() => {
    return () => {
      revealTimeouts.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  function clearRevealTimeouts() {
    revealTimeouts.current.forEach((id) => window.clearTimeout(id));
    revealTimeouts.current = [];
  }

  function handleStart() {
    setStatus("running");
    clearRevealTimeouts();
    REVEAL_DELAYS_MS.forEach((delay, i) => {
      revealTimeouts.current.push(window.setTimeout(() => setRevealStep(i + 1), delay));
    });
    revealTimeouts.current.push(
      window.setTimeout(() => setRevealStep(4), REVEAL_FADE_OUT_MS)
    );
  }

  function handlePause() {
    setStatus("paused");
  }

  function handleResume() {
    setStatus("running");
  }

  function handleReset() {
    setStatus("idle");
    setRemaining(TOTAL_SECONDS);
    setRevealStep(0);
    clearRevealTimeouts();
  }

  return (
    <section className="relative overflow-hidden bg-cloud-milk py-[clamp(96px,15vh,208px)]">
      {/* Atmosphere — slowly washes from Cloud Milk toward Lavender/Mint as the ritual runs */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-[2000ms] ease-out"
        style={{
          opacity: atmosphere * 0.6,
          backgroundImage: "linear-gradient(165deg, var(--color-lavender) 0%, var(--color-mint) 100%)",
        }}
      />

      {/* AURA — ~7s breathing cycle, 0.92 → 1.08 → 0.92 */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[min(72vw,72svh,760px)] w-[min(72vw,72svh,760px)] animate-reset-breathe rounded-full opacity-60 blur-3xl"
          style={{
            backgroundImage:
              "radial-gradient(circle, var(--color-purple), var(--color-lavender) 55%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex max-w-[720px] flex-col items-center px-[clamp(20px,4vw,64px)] text-center">
        {(status === "running" || status === "paused") && (
          <div className="flex min-h-[3.6em] flex-col gap-2 sm:min-h-[3.2em]" aria-live="polite">
            {REVEAL_LINES.map((line, i) => (
              <p
                key={line}
                className={cn(
                  "text-xs font-medium uppercase tracking-[0.18em] text-charcoal/60 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-sm",
                  revealStep > i && revealStep < 4
                    ? "translate-y-0 opacity-100"
                    : "translate-y-2 opacity-0"
                )}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {status === "completed" ? (
          <div className="flex flex-col items-center gap-3">
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-purple">
              RESET HOÀN TẤT
            </span>
            <h2 className="text-[clamp(1.75rem,4.4vw,3rem)] font-medium leading-[1.15] tracking-[-0.01em] text-charcoal">
              CHÀO MỪNG BẠN TRỞ LẠI.
            </h2>
          </div>
        ) : (
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-charcoal/50">
            15 PHÚT DÀNH CHO BẠN
          </p>
        )}

        <p className="mt-5 font-sans text-[clamp(4.5rem,14vw,10.5rem)] font-medium leading-none tracking-[-0.02em] text-charcoal tabular-nums sm:mt-6">
          {formatTime(remaining)}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:mt-12">
          {status === "idle" && (
            <button type="button" onClick={handleStart} className={PRIMARY_BUTTON}>
              BẮT ĐẦU RESET
            </button>
          )}
          {status === "running" && (
            <>
              <button type="button" onClick={handlePause} className={SECONDARY_BUTTON}>
                TẠM DỪNG
              </button>
              <button type="button" onClick={handleReset} className={TEXT_BUTTON}>
                ĐẶT LẠI
              </button>
            </>
          )}
          {status === "paused" && (
            <>
              <button type="button" onClick={handleResume} className={PRIMARY_BUTTON}>
                TIẾP TỤC
              </button>
              <button type="button" onClick={handleReset} className={TEXT_BUTTON}>
                ĐẶT LẠI
              </button>
            </>
          )}
          {status === "completed" && (
            <button type="button" onClick={handleReset} className={SECONDARY_BUTTON}>
              ĐẶT LẠI
            </button>
          )}
        </div>

        <div className="mt-14 flex flex-col items-center gap-3 sm:mt-16">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-charcoal/40">
            ÂM THANH NỀN
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {AMBIENT_OPTIONS.map((option) => {
              const isActive = ambient === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setAmbient((prev) => (prev === option ? null : option))}
                  className={cn(
                    "min-h-11 border px-4 text-xs font-medium tracking-[0.1em] transition-colors duration-300",
                    isActive
                      ? "border-charcoal bg-charcoal text-cloud-milk"
                      : "border-charcoal/20 text-charcoal/60 hover:border-charcoal/40"
                  )}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
