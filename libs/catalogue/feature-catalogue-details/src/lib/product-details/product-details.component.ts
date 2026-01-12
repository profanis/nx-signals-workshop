import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { NgOptimizedImage } from '@angular/common';
import { Comment, ProductsResponse } from '@workshop/catalogue-types';

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
  providers: [],
})
export class ProductDetailsComponent {
  // Signal input from route parameter
  id = input.required<string>();

  // Internal state for favorite toggle
  private isFavorite = signal(false);

  product: ProductsResponse = {
    id: '1',
    name: 'Snake Plant',
    scientificName: 'Dracaena trifasciata',
    description:
      'A hardy houseplant with stiff, sword-like leaves. It tolerates low light and irregular watering.',
    imageUrl:
      'https://commons.wikimedia.org/wiki/Special:FilePath/Snake_Plant_(Sansevieria_trifasciata_%27Laurentii%27)_1.jpg',
    sourcePage:
      'https://commons.wikimedia.org/wiki/File:Snake_Plant_(Sansevieria_trifasciata_%27Laurentii%27)_1.jpg',
    isFavorite: false,
  };

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

  // Toggle favorite state
  toggleFavorite(): void {
    this.isFavorite.update((current) => !current);
  }

  // TODO: Don't have functions in components, use computed signals instead
  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
