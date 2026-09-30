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
import { NgOptimizedImage } from '@angular/common';
import { ProductDetailState } from './product-detail.state';
import { ProductReviewsComponent } from '../components';
import { ProductsApi } from '@workshop/catalogue-data-access';

@Component({
  selector: 'lib-product-details',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    NgOptimizedImage,
    ProductReviewsComponent,
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
  productId = computed(() => Number(this.id()));

  constructor() {
    effect(() => {
      this.state.productId.set(this.productId());
    });
  }

  // Internal state for favorite toggle
  private isFavorite = signal(false);

  // Toggle favorite state
  toggleFavorite(): void {
    this.isFavorite.update((current) => !current);
  }
}
