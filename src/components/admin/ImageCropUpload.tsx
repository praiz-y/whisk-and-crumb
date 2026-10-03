// src/components/admin/ImageCropUpload.tsx
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { uploadImage, type UploadFolder } from "@/lib/admin/upload-image";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/admin/image-constraints";

interface PixelArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropUploadProps {
  aspectRatio: number;
  folder: UploadFolder;
  existingImageUrl?: string;
  onUploaded: (url: string) => void;
  label?: string;
  allowRemove?: boolean;
}

function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("Failed to load image")));
    image.src = src;
  });
}

async function getCroppedBlob(imageSrc: string, pixelCrop: PixelArea): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not supported in this browser.");
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Failed to export cropped image."))),
      "image/jpeg",
      0.9
    );
  });
}

export function ImageCropUpload({
  aspectRatio,
  folder,
  existingImageUrl,
  onUploaded,
  label = "Choose photo",
  allowRemove = false,
}: ImageCropUploadProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(existingImageUrl);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<PixelArea | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onCropComplete = useCallback((_area: PixelArea, areaPixels: PixelArea) => {
    setCroppedArea(areaPixels);
  }, []);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Only JPG, PNG, or WebP images are allowed.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Image must be 8MB or smaller.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedArea(null);
    };
    reader.readAsDataURL(file);
  }

  async function handleConfirmCrop() {
    if (!imageSrc || !croppedArea) return;
    setUploading(true);
    setError(null);

    try {
      const blob = await getCroppedBlob(imageSrc, croppedArea);
      const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
      const result = await uploadImage(folder, file);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPreviewUrl(result.url);
      onUploaded(result.url);
      setImageSrc(null);
    } catch {
      setError("Something went wrong preparing that image. Try a different file.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {previewUrl ? (
        <div className="relative w-32 overflow-hidden rounded-lg border border-border" style={{ aspectRatio }}>
          <Image src={previewUrl} alt="" fill sizes="128px" unoptimized className="object-cover" />
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-brown px-4 py-2 text-sm font-medium text-brown transition-colors duration-200 hover:bg-brown/8">
          {previewUrl ? "Replace photo" : label}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="sr-only" />
        </label>
        {allowRemove && previewUrl ? (
          <button
            type="button"
            onClick={() => {
              setPreviewUrl(undefined);
              setError(null);
              onUploaded("");
            }}
            className="text-sm font-medium text-error transition-colors duration-200 hover:text-error/80"
          >
            Remove photo
          </button>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="text-sm text-error">
          {error}
        </p>
      ) : null}

      {imageSrc ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-dark-text/80 p-4">
          <div className="relative flex-1 overflow-hidden rounded-xl bg-cream-dark">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="flex items-center gap-4 pt-4">
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(event) => setZoom(Number(event.target.value))}
              aria-label="Zoom"
              className="flex-1"
            />
            <button
              type="button"
              onClick={() => setImageSrc(null)}
              disabled={uploading}
              className="rounded-lg border border-cream px-4 py-2 text-sm font-medium text-cream disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmCrop}
              disabled={uploading || !croppedArea}
              className="rounded-lg bg-caramel px-4 py-2 text-sm font-medium text-cream disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Confirm crop"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
