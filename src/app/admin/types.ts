/** What every admin action reports back, shown as a toast. */
export type ActionState = {
  error: string | null;
  message: string | null;
  /** More about a success, shown below the message. */
  details?: string | null;
  /** Build output, shown below the rebuild button. */
  log?: string | null;
};
