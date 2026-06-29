"use client";

import { useLinkStatus } from "next/link";

/**
 * A tiny gold spinner that appears only while its parent <Link>'s navigation is
 * pending. Lets a clickable city card show "loading in" feedback right where it
 * was clicked, instead of the page appearing to freeze during the data fetch.
 * Must be rendered as a descendant of a <Link>.
 */
export function LinkSpinner({ className = "" }: { className?: string }) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span
      role="status"
      aria-label="Loading"
      className={`inline-block w-3.5 h-3.5 rounded-full border-2 border-line-strong border-t-gold animate-spin align-middle ${className}`}
    />
  );
}
