"use client";

import { useState } from "react";
import { ImageCropUpload } from "@/components/admin/ImageCropUpload";
import { createGalleryImage, updateGalleryImage } from "@/app/admin/(dashboard)/gallery/actions";
import { useActionComplete } from "@/lib/admin/use-action-complete";
import type { GalleryImage } from "@/types/content";

interface GalleryImageFormProps {
  image?: GalleryImage;
  onDone: () => void;
}

export function GalleryImageForm({ image, onDone }: GalleryImageFormProps) {
  const isEdit = Boolean(image);
  const { state, formAction, isPending } = useActionComplete(isEdit ? updateGalleryImage : createGalleryImage, onDone);
  const [imageUrl, setImageUrl] = useState<string | undefined>(image?.image);
  const [alt, setAlt] = useState(image?.alt ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-xl border border-border bg-white p-6">
      {isEdit ? <input type="hidden" name="id" value={image!.id} /> : null}
      <input type="hidden" name="imageUrl" value={imageUrl ?? ""} />

      <label className="flex flex-col gap-1.5 text-sm text-brown">
        Alt text
        <input
          type="text"
          name="alt"
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          required
          placeholder="Describe the photo for screen readers"
          className="rounded-lg border border-border px-3 py-2.5 text-dark-text outline-none focus-visible:ring-2 focus-visible:ring-caramel"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-brown">Photo</span>
        <ImageCropUpload aspectRatio={4 / 5} folder="gallery" existingImageUrl={image?.image} onUploaded={setImageUrl} />
      </div>

      {!state.ok ? (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      ) : null}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-caramel px-6 text-[15px] font-medium text-cream disabled:opacity-50"
        >
          {isPending ? "Saving…" : isEdit ? "Save changes" : "Add image"}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="inline-flex min-h-11 items-center justify-center rounded-lg border border-brown px-6 text-[15px] font-medium text-brown"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
