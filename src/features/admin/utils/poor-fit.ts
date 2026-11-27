import type { SourceEntry } from "@/features/backgrounds/utils/metadata";

/** Whether a photo is a poor fit: sampled as one, and not manually waved through. */
export const isPoorFit = (entry: SourceEntry, measured: { poorFit: boolean }) =>
  measured.poorFit && !entry.poorFitIgnored;
