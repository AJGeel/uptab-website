"use client";

import { type ChangeEvent, type SubmitEvent, useRef, useState } from "react";
import { z } from "zod";

import { submitFeedback } from "@/features/feedback/api/submit-feedback";
import { CategoryPill } from "@/features/feedback/components/CategoryPill";
import { FieldError } from "@/features/feedback/components/FieldError";
import { RatingFace, SkyGradient } from "@/features/feedback/components/RatingFace";
import { ThankYou } from "@/features/feedback/components/ThankYou";
import { CATEGORIES, MESSAGE_MAX, RATING_LABELS } from "@/features/feedback/utils/schema";
import "@/features/feedback/feedback.css";

type Category = (typeof CATEGORIES)[number];

const RATING_HINTS = [
  "Pick a face. Honesty welcome, no hard feelings.",
  "Oof. Tell me what broke your heart.",
  "Meh is fair. What would make it better?",
  "Okay is a start. What would make it great?",
  "Nice! What’s missing for a perfect score?",
  "Aww, stop it. (Don’t stop it.)",
];

const legend = "p-0 text-base font-bold text-white";
const hint = "text-sm text-dark-muted";
const inputBase = "fb-field block w-full px-4.5 text-base text-dark-text";

export const FeedbackForm = () => {
  const [phase, setPhase] = useState<"form" | "sending" | "thanks">("form");
  const [category, setCategory] = useState<Category | null>(null);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [failed, setFailed] = useState(false);
  const [shaking, setShaking] = useState(false);
  // The time on the form is measured here, so a skewed clock can't make a real visitor look like a bot
  const [openedAt, setOpenedAt] = useState(() => Date.now());
  const inFlight = useRef(false);
  const firstCategory = useRef<HTMLInputElement>(null);
  const messageField = useRef<HTMLTextAreaElement>(null);
  const emailField = useRef<HTMLInputElement>(null);
  const honeypot = useRef<HTMLInputElement>(null);

  const trimmedEmail = email.trim();
  const emailValid = trimmedEmail === "" || z.email().safeParse(trimmedEmail).success;
  const categoryError = touched && !category;
  const messageError = touched && message.trim() === "";
  const emailError = touched && !emailValid;
  const sending = phase === "sending";

  const reset = () => {
    setPhase("form");
    setCategory(null);
    setRating(0);
    setMessage("");
    setEmail("");
    setTouched(false);
    setFailed(false);
    setOpenedAt(Date.now());
  };

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inFlight.current) {
      return;
    }

    setTouched(true);

    if (!category || message.trim() === "" || !emailValid) {
      setShaking(true);
      const first = !category ? firstCategory : message.trim() === "" ? messageField : emailField;

      first.current?.focus();

      return;
    }

    inFlight.current = true;
    setFailed(false);
    setPhase("sending");

    let ok = false;

    try {
      ({ ok } = await submitFeedback({
        category,
        rating: rating || null,
        message,
        email: trimmedEmail,
        version: new URLSearchParams(window.location.search).get("v"),
        website: honeypot.current?.value ?? "",
        elapsedMs: Date.now() - openedAt,
      }));
    } catch {
      ok = false;
    }

    inFlight.current = false;
    setFailed(!ok);
    setPhase(ok ? "thanks" : "form");
  };

  if (phase === "thanks" && category) {
    return (
      <>
        <SkyGradient />
        <ThankYou category={category} email={trimmedEmail && emailValid ? trimmedEmail : ""} onAgain={reset} />
      </>
    );
  }

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-describedby="fb-note"
      className="flex flex-col gap-8 rounded-[28px] bg-dark-surface p-[clamp(1.375rem,4vw,2.25rem)] ring-1 ring-dark-line ring-inset"
    >
      <SkyGradient />

      <fieldset className="flex flex-col gap-3.5">
        <legend className={`${legend} mb-3.5`}>What’s this about?</legend>
        <div
          onAnimationEnd={() => setShaking(false)}
          className={`flex flex-wrap gap-2.5 ${categoryError && shaking ? "fb-shake" : ""}`}
        >
          {CATEGORIES.map((id, index) => (
              <CategoryPill
                key={id}
                category={id}
                selected={category === id}
                invalid={categoryError}
                inputRef={index === 0 ? firstCategory : undefined}
                onSelect={() => setCategory(id)}
              />
          ))}
        </div>
        {categoryError && <FieldError id="fb-cat-err">Pick one so I know which hat to put on.</FieldError>}
      </fieldset>

      <div className="flex flex-col gap-2.5">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor="fb-msg" className={legend}>
            Your message <span aria-hidden="true" className="text-sky-400">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <span
            id="fb-count"
            aria-live="polite"
            className={`text-[13px] tabular-nums ${message.length > 1900 ? "text-[#ff9aaa]" : "text-dark-muted"}`}
          >
            {message.length} / {MESSAGE_MAX}
          </span>
        </div>
        <textarea
          ref={messageField}
          id="fb-msg"
          required
          maxLength={MESSAGE_MAX}
          rows={6}
          value={message}
          onChange={(event: ChangeEvent<HTMLTextAreaElement>) => setMessage(event.target.value)}
          aria-invalid={messageError}
          aria-describedby={messageError ? "fb-count fb-msg-err" : "fb-count"}
          placeholder="What’s on your mind? Steps to reproduce, wild ideas and kind words all welcome."
          className={`${inputBase} min-h-42 resize-y rounded-[18px] py-4 leading-relaxed`}
        />
        {messageError && <FieldError id="fb-msg-err">Don’t leave me hanging. Even one sentence helps.</FieldError>}
      </div>

      <fieldset className="flex flex-col">
        <legend className={`${legend} mb-1`}>
          How’s UpTab treating you? <span className="font-medium text-dark-muted">(optional)</span>
        </legend>
        <p className={`${hint} mb-4`}>{RATING_HINTS[rating]}</p>
        <div data-any={rating > 0 || undefined} className="fb-rates grid max-w-110 grid-cols-5 gap-2">
          {RATING_LABELS.map((label, index) => {
            const value = index + 1;
            const on = rating === value;

            return (
              <label
                key={label}
                data-on={on || undefined}
                className="fb-rate flex min-w-0 cursor-pointer flex-col items-center gap-2"
              >
                <input
                  type="radio"
                  name="rating"
                  value={value}
                  checked={on}
                  // Radios can't be unchecked by clicking, so a second click on the picked face clears it
                  onChange={() => setRating(value)}
                  onClick={() => on && setRating(0)}
                  className="sr-only"
                />
                <RatingFace rating={value} />
                <span className={`text-[13px] whitespace-nowrap ${on ? "font-extrabold text-white" : "font-semibold text-dark-muted"}`}>
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="flex flex-col gap-2.5">
        <label htmlFor="fb-email" className={legend}>
          Email <span className="font-medium text-dark-muted">(optional)</span>
        </label>
        <input
          ref={emailField}
          id="fb-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={emailError}
          aria-describedby={emailError ? "fb-email-hint fb-email-err" : "fb-email-hint"}
          placeholder="you@example.com"
          className={`${inputBase} h-13 rounded-2xl`}
        />
        <p id="fb-email-hint" className={hint}>
          Only used to reply to you. No newsletters, no funny business.
        </p>
        {emailError && (
          <FieldError id="fb-email-err">That email looks a bit wobbly. Double-check it, or leave it empty.</FieldError>
        )}
      </div>

      {/* A trap for bots: invisible and unreachable for people */}
      <div aria-hidden="true" className="absolute -left-2499.75 size-0 overflow-hidden">
        <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-3.5 pt-1">
        {failed && (
          <FieldError id="fb-failed">Hmm, that didn’t send. Check your connection and try again.</FieldError>
        )}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3.5">
          <button
            type="submit"
            disabled={sending}
            aria-busy={sending}
            onAnimationEnd={() => setShaking(false)}
            className={`fb-send inline-flex min-h-13.5 items-center gap-2.5 rounded-full bg-sky-400 button-wipe px-7 text-[17px] font-extrabold text-black [--wipe-text:var(--color-black)] [--wipe:linear-gradient(rgb(255_255_255/0.3),rgb(255_255_255/0.3))] active:scale-[.97] ${sending ? "cursor-progress opacity-85" : "cursor-pointer"} ${shaking && !categoryError ? "fb-shake" : ""}`}
          >
            {sending ? (
              <>
                <svg className="fb-spin" width="18" height="18" viewBox="0 0 16 16" aria-hidden="true">
                  <circle cx="8" cy="8" r="6" stroke="#020E2C" strokeOpacity=".25" strokeWidth="2" fill="none" />
                  <path d="M14 8a6 6 0 00-6-6" stroke="#020E2C" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>
                Sending…
              </>
            ) : (
              "Send feedback"
            )}
          </button>
          <span id="fb-note" className={hint}>
            {sending
              ? "Hang tight, it’s on its way…"
              : categoryError || messageError || emailError
                ? "Almost there. Fix the bits in pink above."
                : "Fields with * are required. That’s just the one."}
          </span>
        </div>
      </div>
    </form>
  );
};
