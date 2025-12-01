import { Injectable } from '@angular/core';
import { Product } from '@workshop/catalogue-types';
import { Observable, of } from 'rxjs';

@Injectable()
export class ProductsApi {
  getProducts(searchTerm?: string): Observable<Product[]> {
    const mockProducts: Product[] = [
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
    ];

    if (searchTerm) {
      const filtered = mockProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return of(filtered);
    }
    return of(mockProducts);
  }
}
