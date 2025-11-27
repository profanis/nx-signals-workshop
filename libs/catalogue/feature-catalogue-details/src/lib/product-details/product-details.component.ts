import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { NgOptimizedImage } from '@angular/common';
import { Product, Comment } from '@workspace/catalogue/types';

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
})
export class ProductDetailsComponent {
  // Signal input from route parameter
  id = input.required<string>();

  // Internal state for favorite toggle
  private isFavorite = signal(false);

  // Computed signal that simulates fetching product data based on id
  product = computed<Product>(() => {
    const productId = this.id();

    // Mock product data based on ID
    const mockProducts: Record<string, Omit<Product, 'id' | 'isFavorite'>> = {
      '1': {
        name: 'Monstera Deliciosa',
        description:
          'The Monstera Deliciosa, also known as the Swiss Cheese Plant, is a tropical plant native to Central America. It features large, glossy, heart-shaped leaves with natural splits and holes. This stunning plant is perfect for adding a tropical feel to any indoor space. Easy to care for and grows quickly in bright, indirect light.',
        price: 45.99,
        imageUrl: 'https://picsum.photos/seed/monstera/800/600',
      },
      '2': {
        name: 'Fiddle Leaf Fig',
        description:
          'The Fiddle Leaf Fig is a popular indoor tree with large, violin-shaped leaves. Native to West Africa, this plant makes a dramatic statement in any room. It prefers bright, filtered light and consistent watering. With proper care, it can grow up to 6 feet tall indoors.',
        price: 65.0,
        imageUrl: 'https://picsum.photos/seed/fiddle/800/600',
      },
      '3': {
        name: 'Snake Plant',
        description:
          "Also known as Mother-in-Law's Tongue, the Snake Plant is one of the easiest houseplants to care for. It features upright, sword-like leaves with beautiful variegation. Perfect for beginners, it tolerates low light and infrequent watering. NASA studies show it's excellent at purifying air.",
        price: 29.99,
        imageUrl: 'https://picsum.photos/seed/snake/800/600',
      },
      '4': {
        name: 'Pothos Golden',
        description:
          "Golden Pothos is a trailing vine with heart-shaped leaves variegated in shades of green and gold. It's incredibly easy to grow and can thrive in various light conditions. Perfect for hanging baskets or as a climbing plant. Known for its air-purifying qualities.",
        price: 19.99,
        imageUrl: 'https://picsum.photos/seed/pothos/800/600',
      },
      '5': {
        name: 'Peace Lily',
        description:
          'The Peace Lily is an elegant plant featuring dark green leaves and beautiful white flowers. It thrives in low to medium light and helps purify indoor air. The plant will droop when it needs water, making it easy to know when to water. Perfect for offices and bedrooms.',
        price: 34.5,
        imageUrl: 'https://picsum.photos/seed/peace/800/600',
      },
      '6': {
        name: 'Rubber Plant',
        description:
          "The Rubber Plant features large, glossy leaves that can be deep green or variegated. Native to Southeast Asia, it's a robust plant that can grow into a small tree indoors. Prefers bright, indirect light and moderate watering. An excellent choice for beginners.",
        price: 42.0,
        imageUrl: 'https://picsum.photos/seed/rubber/800/600',
      },
      '7': {
        name: 'Aloe Vera',
        description:
          'Aloe Vera is a succulent plant known for its medicinal properties. The gel inside its thick, fleshy leaves can be used to soothe burns and skin irritations. It requires minimal care, preferring bright light and infrequent watering. Perfect for sunny windowsills.',
        price: 15.99,
        imageUrl: 'https://picsum.photos/seed/aloe/800/600',
      },
      '8': {
        name: 'Boston Fern',
        description:
          'The Boston Fern is a classic houseplant with lush, feathery fronds. It prefers high humidity and indirect light, making it perfect for bathrooms. Regular misting and consistent moisture will keep this plant looking its best. A natural air humidifier.',
        price: 27.5,
        imageUrl: 'https://picsum.photos/seed/fern/800/600',
      },
    };

    const productData = mockProducts[productId] || mockProducts['1'];

    return {
      id: productId,
      ...productData,
      isFavorite: this.isFavorite(),
    };
  });

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

  // Generate star rating array for display
  getStarArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }
}
