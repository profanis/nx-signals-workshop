import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { ProductCardComponent } from '@workshop/shared-ui-product-card';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { FavoritesState, ProductsApi } from '@workshop/catalogue-data-access';
import { CatalogueLocalState } from './catalogue.state';
import { PlantFilterComponent, SearchPillsComponent } from '../components';
import { CatalogueFeatureCatalogueFilters } from '@workshop/catalogue-feature-catalogue-filters';
import { FilterState } from '@workshop/catalogue-types';
import { createWrapperAtomicFilterController } from '@workshop/shared-ui-filters';
import { WRAPPER_CONTROLLER } from '@workshop/shared-types';
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
    SearchPillsComponent,
    CatalogueFeatureCatalogueFilters,
  ],

  templateUrl: './catalogue.component.html',
  styleUrl: './catalogue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    ProductsApi,
    CatalogueLocalState,
    {
      provide: WRAPPER_CONTROLLER,
      useFactory: () => createWrapperAtomicFilterController(),
    },
  ],
})
export class CatalogueComponent {
  readonly state = inject(CatalogueLocalState);
  private readonly favoritesState = inject(FavoritesState);
  private readonly router = inject(Router);

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
