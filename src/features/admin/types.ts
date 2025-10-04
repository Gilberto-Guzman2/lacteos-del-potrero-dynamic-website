
export interface Product {
  id?: number;
  name: string;
  category_id: number;
  description: string;
  price: number;
  weight: string;
  image_url?: string;
}

export interface Image {
  id?: number;
  name: string;
  url: string;
  alt_text: string;
}
