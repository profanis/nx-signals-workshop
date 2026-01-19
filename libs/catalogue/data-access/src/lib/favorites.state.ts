import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesState {
  // TODO: Create a signal to hold the list of favorite IDs (e.g. Set<string>)
  private favorites = signal<Set<string>>(new Set());

  // TODO: Create a computed signal for the count of favorites
  count = computed(() => this.favorites().size);

  // TODO: Create a method to check if an item is a favorite (returns boolean)
  isFavorite(productId: string): boolean {
    return this.favorites().has(productId);
  }

  // TODO: Create a method to toggle a favorite
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
