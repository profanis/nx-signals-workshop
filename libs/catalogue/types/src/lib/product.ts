export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl: string;
  isFavorite: boolean;
}

export interface ProductsResponse {
  id: string;
  name: string;
  scientificName: string;
  plantType: string;
  description: string;
  imageUrl: string;
  sourcePage: string;
  isFavorite: boolean;
}
