"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/types/admin";

// Shared by every admin table/grid's delete flow (and any other one-shot
// row action that returns ActionResult): confirm, run, surface an inline
// error on failure, or refresh the page's server data on success.
export function useRowMutation() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<ActionResult>) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (!result.ok) setError(result.error);
      else router.refresh();
    });
  }

  function confirmAndRun(confirmMessage: string, action: () => Promise<ActionResult>) {
    if (!window.confirm(confirmMessage)) return;
    run(action);
  }

  return { isPending, error, run, confirmAndRun };
}
