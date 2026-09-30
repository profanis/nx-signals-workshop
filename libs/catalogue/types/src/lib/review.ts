export interface Review {
  id: string;
  productId: number;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  createdAt: string;
}

export type NewReview = Pick<Review, 'productId' | 'rating' | 'text'>;
