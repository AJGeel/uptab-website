"use client";

import { useState } from "react";

import type { Weather } from "@/features/home/season-weather";
import { cn } from "@/utils/cn";

/** The scale the forecast bars are drawn on, in degrees. */
const BAR_MIN = -6;
const BAR_MAX = 32;
const barPosition = (degrees: number) => ((degrees - BAR_MIN) / (BAR_MAX - BAR_MIN)) * 100;

/** A fake weather widget over a day/night sky. Clicking the temperature toggles the forecast, like in UpTab. */
export const WeatherCard = ({ weather }: { weather: Weather }) => {
  const [open, setOpen] = useState(true);

  return (
    <article className="ut-s4 flex flex-wrap items-stretch gap-6 rounded-3xl bg-white p-7 ring-1 ring-[#e2e8ef] ring-inset">
      <div className="flex flex-[1_1_200px] flex-col gap-2.5 p-1">
        <h3 className="text-[26px] font-extrabold tracking-tight">A peek outside</h3>
        <p className="text-base leading-relaxed text-muted">
          The sun icon clocks out at sunset and the moon clocks in. Tap the temperature for three days of forecast.
        </p>
      </div>
      <div className="relative min-h-70 flex-[2_1_320px] overflow-hidden rounded-[18px] bg-linear-to-b from-[#8ec9db] to-[#d4ecf1]">
        <div className="ut-night absolute inset-0 bg-linear-to-b from-[#0b1830] to-[#263e66]" aria-hidden="true">
          {[
            ["12%", "14%", 3],
            ["30%", "8%", 2],
            ["58%", "18%", 3],
            ["76%", "6%", 2],
            ["88%", "24%", 2],
          ].map(([left, top, size]) => (
            <span
              key={left}
              className="absolute rounded-full bg-white"
              style={{ left, top, width: size, height: size }}
            />
          ))}
        </div>
        <div
          className="ut-sun absolute top-[10%] right-[12%] size-14 rounded-full bg-[#f7d266] shadow-[0_0_0_10px_rgba(247,210,102,0.25),0_0_0_22px_rgba(247,210,102,0.12)]"
          aria-hidden="true"
        />
        <div
          className="ut-moon absolute top-[10%] right-[12%] size-12 rounded-full bg-[#edeff5] shadow-[inset_-12px_-4px_0_#c9cfdc]"
          aria-hidden="true"
        />

        <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3 rounded-2xl bg-white/90 px-4 py-3.5 shadow-[0_16px_30px_-18px_rgba(2,14,44,0.5)] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen((current) => !current)}
              className={cn(
                "inline-flex min-h-11 cursor-pointer items-center gap-2.5 rounded-xl bg-[#f1f5f9] py-1 pr-3 pl-1 text-black",
                !open && "ut-ping"
              )}
            >
              <span className="relative inline-block size-9" aria-hidden="true">
                <svg className="ut-dayicon absolute inset-0" width="36" height="36" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="6.5" fill="#F2C94C" />
                  <path
                    d="M18 5v4M18 27v4M5 18h4M27 18h4M8.8 8.8l2.8 2.8M24.4 24.4l2.8 2.8M8.8 27.2l2.8-2.8M24.4 11.6l2.8-2.8"
                    stroke="#F2C94C"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
                <svg className="ut-nighticon absolute inset-0" width="36" height="36" viewBox="0 0 36 36">
                  <path d="M24 23.5A9 9 0 0 1 14.5 9a9 9 0 1 0 9.5 14.5z" fill="#3E5A8C" />
                </svg>
              </span>
              <span className="text-[28px] font-extrabold tracking-[-0.03em]">{weather.temperature.toFixed(1)}°</span>
            </button>
            <div className="flex flex-col text-[13px] text-muted">
              <span className="text-sm font-bold text-black">Cat Pants</span>
              {weather.condition}
            </div>
          </div>
          {open && (
            <div className="grid grid-cols-3 gap-2">
              {weather.forecast.map(({ day, high, low }, i) => (
                <div
                  key={day}
                  className="ut-rise rounded-xl bg-[#f1f5f9] px-3 py-2.5"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="text-[13px] font-bold text-black">{day}</div>
                  <div className="text-[13px] text-body">
                    {high}° <span className="text-[#6a7686]">/ {low}°</span>
                  </div>
                  <div className="relative mt-1.5 h-1 rounded-sm bg-[#e2e8ef]">
                    <span
                      className="ut-grow absolute inset-y-0 origin-left rounded-sm bg-linear-to-r from-[#8cc4f0] to-sky-500"
                      style={{ left: `${barPosition(low)}%`, right: `${100 - barPosition(high)}%`, animationDelay: `${0.15 + i * 0.08}s` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};
