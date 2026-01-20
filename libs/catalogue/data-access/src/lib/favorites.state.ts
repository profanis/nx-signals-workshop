import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesState {
  private favorites = signal<Set<string>>(new Set());

  count = computed(() => this.favorites().size);

  isFavorite(productId: string): boolean {
    return this.favorites().has(productId);
  }

  toggleFavorite(productId: string): void {
    this.favorites.update((current) => {
      const existingFavorites = new Set(current);
      if (existingFavorites.has(productId)) {
        existingFavorites.delete(productId);
      } else {
        existingFavorites.add(productId);
      }
      return existingFavorites;
    });
  }
}
