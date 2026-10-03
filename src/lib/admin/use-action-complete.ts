"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/types/admin";

const initialState: ActionResult = { ok: true };

// Shared by every admin form built on useActionState (CategoryForm,
// ProductForm, GalleryImageForm, SettingsForm): runs router.refresh() and
// onSuccess() exactly once, the render after a pending submission resolves
// with state.ok — never on the initial mount, and never twice for the same
// submission.
export function useActionComplete(
  action: (prevState: ActionResult, formData: FormData) => Promise<ActionResult>,
  onSuccess: () => void
) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const router = useRouter();
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !isPending && state.ok) {
      router.refresh();
      onSuccess();
    }
    wasPending.current = isPending;
  }, [isPending, state, router, onSuccess]);

  return { state, formAction, isPending };
}
