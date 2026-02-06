import {
  computed,
  effect,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProductsApi } from '@workshop/catalogue-data-access';
import { FilterState, ProductsResponse } from '@workshop/catalogue-types';
import { PageableResponse } from '@workshop/shared-types';
import { deserializeQueryParamsToObject } from '@workshop/shared-util-router';

@Injectable()
export class CatalogueLocalState {
  private readonly productsApi = inject(ProductsApi);
  private readonly route = inject(ActivatedRoute);

  // Default filter state
  private readonly defaultFilterState: FilterState = {
    lightRequirements: [],
    plantProperty: null,
    plantType: null,
  };

  // Deserialize query params to FilterState
  filterState = toSignal(
    this.route.queryParams.pipe(
      map((params) =>
        deserializeQueryParamsToObject<FilterState>(
          params,
          this.defaultFilterState,
        ),
      ),
    ),
    { initialValue: this.defaultFilterState },
  );

  constructor() {
    effect(() => {
      console.log(this.filterState());
    });
  }

  totalProducts = computed(() => this.productsResource.value()?.total || 0);
  searchTerm = signal('');
  page = signal(0);

  products = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.combinedProducts();
    }
    return this.combinedProducts().filter((product) =>
      product.name.toLowerCase().includes(term),
    );
  });

  private productsResource = rxResource({
    params: () => ({
      page: this.page(),
    }),
    stream: ({ params }) => this.productsApi.getProducts(params.page),
  });

  private combinedProducts = linkedSignal<
    PageableResponse<ProductsResponse> | undefined,
    ProductsResponse[]
  >({
    source: this.productsResource.value,
    computation: (source, previous) => {
      const hasNewData = source?.data && Array.isArray(source.data);
      const hasPreviousData =
        previous?.value &&
        Array.isArray(previous.value) &&
        previous.value.length > 0;

      if (hasNewData && hasPreviousData) {
        return [...(previous.value as []), ...source.data];
      }

      return source?.data ?? previous?.value ?? [];
    },
  });
}
