import { computed, inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsApi } from '@workshop/catalogue-data-access';

@Injectable()
export class CatalogueLocalState {
  private readonly productsApi = inject(ProductsApi);

  products = computed(() => this.productsResource.value());
  searchTerm = signal('');

  private productsResource = rxResource({
    params: () => ({
      searchTerm: this.searchTerm(),
    }),
    stream: ({ params }) => this.productsApi.getProducts(params.searchTerm),
  });
}
