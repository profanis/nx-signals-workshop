import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { ProductCardComponent } from '@workshop/shared-ui-product-card';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { FavoritesState, ProductsApi } from '@workshop/catalogue-data-access';
import { CatalogueLocalState } from './catalogue.state';
import { PlantFilterComponent } from '../components';
@Component({
  selector: 'lib-feature-catalogue',
  imports: [
    ProductCardComponent,
    MatInputModule,
    MatSidenavModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    PlantFilterComponent,
  ],
  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductsApi, CatalogueLocalState],
})
export class CatalogueComponent {
  readonly state = inject(CatalogueLocalState);
  private readonly favoritesState = inject(FavoritesState);

  // TODO: Create a productsWithFavourites computed that returns the products with the correct isFavorite boolean flag
  productsWithFavourites = computed(() => {
    return this.state.products().map((product) => {
      return {
        ...product,
        isFavorite: this.favoritesState.isFavorite(product.id),
      };
    });
  });

  // Handle favorite toggle
  onToggleFavorite(productId: string): void {
    this.favoritesState.toggleFavorite(productId);
  }

  // Update search term
  onSearchChange(value: string): void {
    this.state.searchTerm.set(value);
  }

  onLoadMore(): void {
    this.state.page.update((page) => page + 1);
  }
}
