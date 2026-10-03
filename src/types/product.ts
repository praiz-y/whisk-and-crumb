export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  category: string;
  categoryId: string;
  image: string;
  featured: boolean;
  available?: boolean;
}
