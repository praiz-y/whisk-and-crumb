export interface Testimonial {
  id: string;
  name: string;
  quote: string;
  role?: string;
  image?: string;
}

export interface GalleryImage {
  id: string;
  image: string;
  alt: string;
  sortOrder: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}
