"use client";

import { useState } from "react";
import { ImageCropUpload } from "@/components/admin/ImageCropUpload";
import { updateSettings } from "@/app/admin/(dashboard)/settings/actions";
import { useActionComplete } from "@/lib/admin/use-action-complete";
import type { BusinessSettings } from "@/types/business";

export function SettingsForm({ settings }: { settings: BusinessSettings }) {
  const [savedMessage, setSavedMessage] = useState(false);
  const { state, formAction, isPending } = useActionComplete(updateSettings, () => setSavedMessage(true));
  const [mapImageUrl, setMapImageUrl] = useState<string | undefined>(settings.mapImageUrl);
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsappNumber ?? "");
  const [phone, setPhone] = useState(settings.phone ?? "");
  const [email, setEmail] = useState(settings.email ?? "");
  const [address, setAddress] = useState(settings.address ?? "");
  const [instagramUrl, setInstagramUrl] = useState(settings.social.instagram ?? "");
  const [facebookUrl, setFacebookUrl] = useState(settings.social.facebook ?? "");
  const [tiktokUrl, setTiktokUrl] = useState(settings.social.tiktok ?? "");
  const [xUrl, setXUrl] = useState(settings.social.x ?? "");

  const inputClass =
    "rounded-lg border border-border px-3 py-2.5 text-dark-text outline-none focus-visible:ring-2 focus-visible:ring-caramel";
  const labelClass = "flex flex-col gap-1.5 text-sm text-brown";

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4 rounded-xl border border-border bg-white p-6">
      <input type="hidden" name="mapImageUrl" value={mapImageUrl ?? ""} />

      <label className={labelClass}>
        WhatsApp number (required)
        <input
          type="text"
          name="whatsappNumber"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
          required
          placeholder="2340000000000"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Phone
        <input
          type="text"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          pattern="\d{7,15}"
          title="7-15 digits, no spaces or symbols"
          placeholder="2340000000000"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Email
        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </label>

      <label className={labelClass}>
        Address
        <input type="text" name="address" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClass} />
      </label>

      <label className={labelClass}>
        Instagram URL
        <input
          type="url"
          name="instagramUrl"
          value={instagramUrl}
          onChange={(e) => setInstagramUrl(e.target.value)}
          placeholder="https://instagram.com/..."
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        Facebook URL
        <input
          type="url"
          name="facebookUrl"
          value={facebookUrl}
          onChange={(e) => setFacebookUrl(e.target.value)}
          placeholder="https://facebook.com/..."
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        TikTok URL
        <input
          type="url"
          name="tiktokUrl"
          value={tiktokUrl}
          onChange={(e) => setTiktokUrl(e.target.value)}
          placeholder="https://tiktok.com/@..."
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        X URL
        <input
          type="url"
          name="xUrl"
          value={xUrl}
          onChange={(e) => setXUrl(e.target.value)}
          placeholder="https://x.com/..."
          className={inputClass}
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-brown">Map image (satellite screenshot)</span>
        <ImageCropUpload
          aspectRatio={3 / 2}
          folder="settings"
          existingImageUrl={settings.mapImageUrl}
          onUploaded={setMapImageUrl}
          label="Choose map image"
          allowRemove
        />
      </div>

      {!state.ok ? (
        <p role="alert" className="text-sm text-error">
          {state.error}
        </p>
      ) : null}
      {state.ok && savedMessage ? <p className="text-sm text-success">Saved.</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex min-h-11 w-fit items-center justify-center rounded-lg bg-caramel px-6 text-[15px] font-medium text-cream disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
