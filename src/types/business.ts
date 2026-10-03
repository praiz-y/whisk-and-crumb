export interface BusinessConfig {
  name: string;
  tagline: string;
  description: string;
  siteUrl: string;
  currency: string;
  currencySymbol: string;
}

export interface BusinessSocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  x?: string;
}

export interface BusinessSettings {
  whatsappNumber: string;
  phone?: string;
  email?: string;
  address?: string;
  mapImageUrl?: string;
  social: BusinessSocialLinks;
}
