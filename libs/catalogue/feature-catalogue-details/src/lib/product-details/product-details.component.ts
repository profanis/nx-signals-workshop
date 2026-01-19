import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { NgOptimizedImage } from '@angular/common';
import { Comment } from '@workshop/catalogue-types';
import { ProductDetailState } from './product-detail.state';
import { ProductsApi } from '@workshop/catalogue-data-access';

@Component({
  selector: 'lib-product-details',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatListModule,
    NgOptimizedImage,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductDetailState, ProductsApi],
})
export class ProductDetailsComponent {
  state = inject(ProductDetailState);
  // Signal input from route parameter
  id = input.required<string>();

  constructor() {
    effect(() => {
      this.state.productId.set(Number(this.id()));
    });
  }

  // Internal state for favorite toggle
  private isFavorite = signal(false);

  // Static comments signal
  comments = signal<Comment[]>([
    {
      user: 'Sarah Johnson',
      text: 'Absolutely love this plant! It arrived in perfect condition and has been thriving in my living room. Highly recommend!',
      rating: 5,
    },
    {
      user: 'Michael Chen',
      text: 'Great quality and well-packaged. The plant is healthy and beautiful. Will definitely order again.',
      rating: 5,
    },
    {
      user: 'Emma Rodriguez',
      text: "Beautiful plant, though it took a few days to adjust to my home. Now it's doing great! Happy with my purchase.",
      rating: 4,
    },
  ]);

  commentsView = computed(() =>
    this.comments().map((comment) => ({
      ...comment,
      stars: Array.from({ length: 5 }, (_, i) => i < comment.rating),
    }))
  );

  // Toggle favorite state
  toggleFavorite(): void {
    this.isFavorite.update((current) => !current);
  }

  // TODO: Don't have functions in components, use computed signals instead
  // getStarArray(rating: number): boolean[] {
  //   return Array.from({ length: 5 }, (_, i) => i < rating);
  // }
}
