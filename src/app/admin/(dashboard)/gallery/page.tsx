import { getGalleryImages } from "@/lib/data/gallery";
import { GalleryManager } from "@/components/admin/GalleryManager";

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-medium text-dark-text">Gallery</h1>
      <GalleryManager images={images} />
    </div>
  );
}
