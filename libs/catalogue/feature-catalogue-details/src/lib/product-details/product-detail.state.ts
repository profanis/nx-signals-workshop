import { inject, Injectable, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsApi } from '@workshop/catalogue-data-access';
import { of } from 'rxjs';

@Injectable()
export class ProductDetailState {
  private readonly productsApi = inject(ProductsApi);

  productId = signal<number | undefined>(undefined);

  product = rxResource({
    params: () => ({ productId: this.productId() }),
    stream: ({ params }) => {
      if (!params.productId) {
        return of(null);
      }
      return this.productsApi.getProductById(params.productId);
    },
  });
}
