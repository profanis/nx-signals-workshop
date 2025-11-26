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

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  isFavorite: boolean;
}

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, NgOptimizedImage],
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
