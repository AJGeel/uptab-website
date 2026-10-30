"use client";

import { useEffect, useState } from "react";

/** "<label> · 4s", counting up, so a long task visibly makes progress. */
export const ElapsedTime = ({ label }: { label: string }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((value) => value + 1), 1000);

    return () => clearInterval(timer);
  }, []);

  return `${label} · ${seconds}s`;
};
