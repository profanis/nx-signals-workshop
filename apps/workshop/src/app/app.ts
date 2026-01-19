import { Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FavoritesState } from '@workshop/catalogue-data-access';
import { HeaderComponent } from '@workshop/shared-ui-header';

@Component({
  imports: [RouterModule, HeaderComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly favoritesState = inject(FavoritesState);

  favoriteCount = computed(() => this.favoritesState.count());
}
