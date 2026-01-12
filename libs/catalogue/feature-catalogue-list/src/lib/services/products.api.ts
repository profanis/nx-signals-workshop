import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ProductsResponse } from '@workshop/catalogue-types';
import { map, Observable } from 'rxjs';
import { PageableResponse } from '@workshop/shared-types';

@Injectable()
export class ProductsApi {
  private readonly http = inject(HttpClient);
  private readonly apiKey = 'sb_publishable_WRlSo4jZkMz1zR6aniTEkg_F3dsjnEj';
  private readonly apiHost = 'https://rkvvclbngyupeexgnqou.supabase.co/rest/v1';

  getProducts(
    page = 0,
    itemsPerPage = 9
  ): Observable<PageableResponse<ProductsResponse>> {
    return this.http
      .get<ProductsResponse[]>(`${this.apiHost}/products`, {
        headers: {
          // TODO: the headers should be moved to an interceptor
          apikey: this.apiKey,
          Range: `${page * itemsPerPage}-${
            page * itemsPerPage + itemsPerPage - 1
          }`,
          Prefer: 'count=exact',
        },
        observe: 'response',
      })
      .pipe(
        map((response) => {
          const contentRangeHeader = response.headers.get('Content-Range');
          let totalCount = 0;
          if (contentRangeHeader) {
            // The header format is typically "0-9/1234"
            // We split by '/' and take the last part.
            const total = contentRangeHeader.split('/').pop();
            totalCount = total ? parseInt(total, 10) : 0;
          }

          return {
            data: response.body || [],
            total: totalCount,
          };
        })
      );
  }

  getProductById(id: number): Observable<ProductsResponse> {
    return this.http
      .get<ProductsResponse>(`${this.apiHost}/products?id=eq.${id}`, {
        // TODO: the headers should be moved to an interceptor
        headers: {
          apikey: this.apiKey,
        },
      })
      .pipe(
        map((products) => {
          if (products && Array.isArray(products) && products.length > 0) {
            return products[0];
          }
          throw new Error('Product not found');
        })
      );
  }
}
