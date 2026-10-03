"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Shared dialog behavior (extracted from the MobileMenu pattern): locks
 * background scroll, moves focus into the container, traps Tab within it,
 * closes on Escape, and restores focus to the trigger on unmount.
 *
 * For components that mount only while open (e.g. an AnimatePresence-driven
 * modal panel, as opposed to MobileMenu's always-mounted + isOpen-flag
 * approach). The effect intentionally runs once per mount, not per `onClose`
 * identity change — re-running on every parent re-render would re-lock
 * scroll and re-focus the first element on every unrelated state update.
 */
export function useDialogA11y(onClose: () => void, containerRef: RefObject<HTMLElement | null>) {
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    const container = containerRef.current;
    const focusable = container?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    focusable?.[0]?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !focusable || focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
