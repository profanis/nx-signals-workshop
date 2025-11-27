import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '@workshop/catalogue-types';
@Component({
  selector: 'lib-ui-product-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  product = input.required<Product>();
  toggleFavorite = output<string>();

  onToggleFavorite(): void {
    this.toggleFavorite.emit(this.product().id);
  }
}
