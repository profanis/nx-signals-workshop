import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
} from '@angular/core';
import { ProductCardComponent } from '@workshop/shared/ui-product-card';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { Product } from '@workshop/catalogue-types';

@Component({
  selector: 'lib-feature-catalogue',
  imports: [
    ProductCardComponent,
    MatInputModule,
    MatSidenavModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
  ],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogueComponent {
  // Signal for the product list
  products = signal<Product[]>([
    {
      id: '1',
      name: 'Monstera Deliciosa',
      price: 45.99,
      imageUrl: 'https://picsum.photos/seed/monstera/300/200',
      isFavorite: false,
    },
    {
      id: '2',
      name: 'Fiddle Leaf Fig',
      price: 65.0,
      imageUrl: 'https://picsum.photos/seed/fiddle/300/200',
      isFavorite: true,
    },
    {
      id: '3',
      name: 'Snake Plant',
      price: 29.99,
      imageUrl: 'https://picsum.photos/seed/snake/300/200',
      isFavorite: false,
    },
    {
      id: '4',
      name: 'Pothos Golden',
      price: 19.99,
      imageUrl: 'https://picsum.photos/seed/pothos/300/200',
      isFavorite: true,
    },
    {
      id: '5',
      name: 'Peace Lily',
      price: 34.5,
      imageUrl: 'https://picsum.photos/seed/peace/300/200',
      isFavorite: false,
    },
    {
      id: '6',
      name: 'Rubber Plant',
      price: 42.0,
      imageUrl: 'https://picsum.photos/seed/rubber/300/200',
      isFavorite: false,
    },
    {
      id: '7',
      name: 'Aloe Vera',
      price: 15.99,
      imageUrl: 'https://picsum.photos/seed/aloe/300/200',
      isFavorite: true,
    },
    {
      id: '8',
      name: 'Boston Fern',
      price: 27.5,
      imageUrl: 'https://picsum.photos/seed/fern/300/200',
      isFavorite: false,
    },
  ]);

  // Signal for the search term
  searchTerm = signal('');

  // Computed signal that filters products based on search term
  filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.products();
    }
    return this.products().filter((product) =>
      product.name.toLowerCase().includes(term)
    );
  });

  // Handle favorite toggle
  onToggleFavorite(productId: string): void {
    this.products.update((products) =>
      products.map((product) =>
        product.id === productId
          ? { ...product, isFavorite: !product.isFavorite }
          : product
      )
    );
  }

  // Update search term
  onSearchChange(value: string): void {
    this.searchTerm.set(value);
  }
}
