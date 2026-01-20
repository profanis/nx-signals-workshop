import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesState {
  // TODO: Create a signal to hold the list of favorite IDs (e.g. Set<string>)

  // TODO: Create a computed signal for the count of favorites
  count = signal(0);

  // TODO: Create a method to check if an item is a favorite (returns boolean)
  isFavorite(productId: string): boolean {
    return false;
  }

  // TODO: Create a method to toggle a favorite
  toggleFavorite(productId: string): void {
    // If the item is already a favorite, remove it
    // Otherwise, add it to the favorites
  }
}
