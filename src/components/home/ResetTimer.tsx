"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const TOTAL_SECONDS = 15 * 60;
/** Atmosphere reaches full intensity after this many elapsed seconds, then holds. */
const ATMOSPHERE_RAMP_SECONDS = 180;

const REVEAL_LINES = ["ĐẶT ĐIỆN THOẠI XUỐNG.", "ĐẮP MẶT NẠ.", "TẮT THẾ GIỚI BÊN NGOÀI."];
/** ms after start — sequential reveal, then a fade-out so the ring stays dominant. */
const REVEAL_DELAYS_MS = [900, 3400, 6200];
const REVEAL_FADE_OUT_MS = 10500;

const RADIUS = 88;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

type Status = "idle" | "running" | "paused" | "completed";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

const PRIMARY_BUTTON =
  "flex min-h-11 items-center justify-center bg-cloud-milk px-7 text-xs font-medium tracking-[0.14em] text-charcoal transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-lavender";
const SECONDARY_BUTTON =
  "flex min-h-11 items-center justify-center border border-cloud-milk/40 px-7 text-xs font-medium tracking-[0.14em] text-cloud-milk transition-colors duration-200 hover:border-cloud-milk hover:bg-cloud-milk/10";
const TEXT_BUTTON =
  "flex min-h-11 items-center px-1 text-xs font-medium tracking-[0.12em] text-cloud-milk/60 underline underline-offset-4 transition-colors hover:text-cloud-milk";

/**
 * Consolidated "15-MINUTE RESET" — the one signature section replacing the
 * previous separate Ritual (300–400svh pinned choreography) + ResetTimer
 * sections. Carries the id="nghi-thuc-15-phut" anchor that nav/footer/story
 * links already point at (Ritual.tsx no longer renders on the homepage but
 * keeps its own copy for reuse elsewhere — see CLAUDE.md > SECTION 06).
 * Countdown state machine and reveal-line logic are unchanged from the
 * original ResetTimer; only the visual composition and the no-op ambient
 * sound toggle (never wired to real audio) changed.
 */
export function ResetTimer() {
  const [status, setStatus] = useState<Status>("idle");
  const [remaining, setRemaining] = useState(TOTAL_SECONDS);
  const [revealStep, setRevealStep] = useState(0);

  const intervalRef = useRef<number | null>(null);
  const revealTimeouts = useRef<number[]>([]);

  const elapsed = TOTAL_SECONDS - remaining;
  const atmosphere = Math.min(elapsed / ATMOSPHERE_RAMP_SECONDS, 1);
  const progress = remaining / TOTAL_SECONDS;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

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
    <section
      id="nghi-thuc-15-phut"
      className="relative scroll-mt-24 overflow-hidden bg-charcoal py-[clamp(40px,4vw,64px)]"
    >
      {/* Effect — slow breathing Purple atmosphere, intensity ramps with elapsed time */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="h-[min(70vw,70vh,720px)] w-[min(70vw,70vh,720px)] animate-reset-breathe rounded-full blur-3xl transition-opacity duration-[2000ms] ease-out"
          style={{
            opacity: 0.35 + atmosphere * 0.25,
            backgroundImage:
              "radial-gradient(circle, var(--color-purple), transparent 72%)",
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-[clamp(340px,34vw,440px)] max-w-[1600px] flex-col items-center gap-10 px-[clamp(20px,4vw,64px)] text-center xl:grid xl:grid-cols-[35fr_30fr_35fr] xl:items-center xl:gap-8 xl:text-left">
        {/* LEFT — brand framing */}
        <div className="flex flex-col items-center xl:items-start">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-lavender">
            DOPAMIND RITUAL
          </span>
          <h2 className="mt-4 max-w-[18ch] font-serif text-[clamp(1.85rem,3vw,2.5rem)] font-medium leading-[1.15] tracking-[-0.01em] text-cloud-milk">
            15 phút mỗi ngày. Từ quá tải đến cân bằng.
          </h2>
          <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-cloud-milk/60">
            Chỉ 15 phút, để tạm rời khỏi nhịp độ bên ngoài và trở lại với chính mình.
          </p>
        </div>

        {/* CENTER — circular timer */}
        <div className="flex flex-col items-center">
          <div className="relative flex h-[clamp(200px,20vw,260px)] w-[clamp(200px,20vw,260px)] items-center justify-center">
            <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="100"
                cy="100"
                r={RADIUS}
                fill="none"
                stroke="var(--color-cloud-milk)"
                strokeOpacity="0.15"
                strokeWidth="2"
              />
              <circle
                cx="100"
                cy="100"
                r={RADIUS}
                fill="none"
                stroke="var(--color-lavender)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1000ms linear" }}
              />
            </svg>
            <span className="font-serif text-[clamp(2.25rem,4vw,3.25rem)] font-medium tabular-nums text-cloud-milk">
              {formatTime(remaining)}
            </span>
          </div>

          <div className="mt-5 min-h-[1.5em]">
            {(status === "running" || status === "paused") && (
              <p
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.16em] text-cloud-milk/55 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  revealStep > 0 && revealStep < 4 ? "opacity-100" : "opacity-0"
                )}
                aria-live="polite"
              >
                {REVEAL_LINES[Math.min(revealStep, REVEAL_LINES.length) - 1] ?? ""}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT — statement + action */}
        <div className="flex flex-col items-center gap-5 xl:items-start">
          {status === "completed" ? (
            <>
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-lavender">
                RESET HOÀN TẤT
              </span>
              <p className="max-w-[26ch] text-sm leading-relaxed text-cloud-milk/70">
                Chào mừng bạn trở lại. Những khoảnh khắc nhỏ tạo nên thay đổi lớn.
              </p>
              <button type="button" onClick={handleReset} className={SECONDARY_BUTTON}>
                ĐẶT LẠI
              </button>
            </>
          ) : (
            <>
              <p className="max-w-[26ch] text-sm leading-relaxed text-cloud-milk/70">
                Những khoảnh khắc nhỏ tạo nên thay đổi lớn.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 xl:justify-start">
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
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
