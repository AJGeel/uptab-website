import type { SourceMetadata } from "@/features/backgrounds/utils/metadata";

export type FileChange =
  | { kind: "add"; to: string }
  | { kind: "move"; from: string; to: string }
  | { kind: "delete"; from: string };

export type Change = {
  metadata: SourceMetadata;
  files: FileChange[];
};
