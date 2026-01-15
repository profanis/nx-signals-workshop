import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ProductCardComponent } from '@workshop/shared-ui-product-card';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { ProductsApi } from '@workshop/catalogue-data-access';
import { CatalogueLocalState } from './catalogue.state';
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
  providers: [ProductsApi, CatalogueLocalState],
})
export class CatalogueComponent {
  readonly state = inject(CatalogueLocalState);

  // Handle favorite toggle
  onToggleFavorite(productId: string): void {
    // this.products.update((products) =>
    //   products.map((product) =>
    //     product.id === productId
    //       ? { ...product, isFavorite: !product.isFavorite }
    //       : product
    //   )
    // );
  }

  // Update search term
  onSearchChange(value: string): void {
    this.state.searchTerm.set(value);
  }

  onLoadMore(): void {
    this.state.page.update((page) => page + 1);
  }
}
