import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

import { ProductsResponse } from '@workshop/catalogue-types';
import { ProductCardComponent } from '../components';
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
})
export class CatalogueComponent {
  // Signal for the product list
  products = signal<ProductsResponse[]>([
    {
      id: '1',
      name: 'Snake Plant',
      scientificName: 'Dracaena trifasciata',
      description:
        'A hardy houseplant with stiff, sword-like leaves. It tolerates low light and irregular watering.',
      imageUrl:
        'https://commons.wikimedia.org/wiki/Special:FilePath/Snake_Plant_(Sansevieria_trifasciata_%27Laurentii%27)_1.jpg',
      sourcePage:
        'https://commons.wikimedia.org/wiki/File:Snake_Plant_(Sansevieria_trifasciata_%27Laurentii%27)_1.jpg',
      isFavorite: false,
    },
    {
      id: '2',
      name: 'Peace Lily',
      scientificName: 'Spathiphyllum wallisii',
      description:
        'Known for its white spoon-shaped flowers and glossy green leaves. It droops when thirsty.',
      imageUrl:
        'https://commons.wikimedia.org/wiki/Special:FilePath/Peace_lily_-_1.jpg',
      sourcePage: 'https://commons.wikimedia.org/wiki/File:Peace_lily_-_1.jpg',
      isFavorite: true,
    },
    {
      id: '3',
      name: 'Lavender',
      scientificName: 'Lavandula angustifolia',
      description:
        'An aromatic herb with purple flowers, often used for its calming scent and essential oils.',
      imageUrl:
        'https://commons.wikimedia.org/wiki/Special:FilePath/Lavandula_angustifolia_002.JPG',
      sourcePage:
        'https://commons.wikimedia.org/wiki/File:Lavandula_angustifolia_002.JPG',
      isFavorite: false,
    },
    {
      id: '4',
      name: 'Sunflower',
      scientificName: 'Helianthus annuus',
      description:
        "A tall annual plant with massive yellow flower heads that track the sun's movement.",
      imageUrl:
        'https://commons.wikimedia.org/wiki/Special:FilePath/Helianthus_annuus_sunflower.jpg',
      sourcePage:
        'https://commons.wikimedia.org/wiki/File:Helianthus_annuus_sunflower.jpg',
      isFavorite: true,
    },
    {
      id: '5',
      name: 'Aloe Vera',
      scientificName: 'Aloe barbadensis miller',
      description:
        'A succulent species with thick fleshy leaves containing a soothing gel used for skin burns.',
      imageUrl:
        'https://commons.wikimedia.org/wiki/Special:FilePath/Aloe_vera.jpg',
      sourcePage: 'https://commons.wikimedia.org/wiki/File:Aloe_vera.jpg',
      isFavorite: false,
    },
    {
      id: '6',
      name: 'Pothos',
      scientificName: 'Epipremnum aureum',
      description:
        'A popular trailing houseplant with heart-shaped leaves, often variegated with yellow or white.',
      imageUrl:
        'https://commons.wikimedia.org/wiki/Special:FilePath/Epipremnum_aureum1.jpg',
      sourcePage:
        'https://commons.wikimedia.org/wiki/File:Epipremnum_aureum1.jpg',
      isFavorite: false,
    },
    {
      id: '7',
      name: 'Rubber Plant',
      scientificName: 'Ficus elastica',
      description:
        'An impressive indoor tree with large, glossy, dark green or burgundy leaves.',
      imageUrl:
        'https://commons.wikimedia.org/wiki/Special:FilePath/Ficus_elastica.jpg',
      sourcePage: 'https://commons.wikimedia.org/wiki/File:Ficus_elastica.jpg',
      isFavorite: true,
    },
    {
      id: '8',
      name: 'Fiddle-Leaf Fig',
      scientificName: 'Ficus lyrata',
      description:
        'A trendy indoor tree with large, violin-shaped leaves that require bright, filtered light.',
      imageUrl:
        'https://commons.wikimedia.org/wiki/Special:FilePath/Ficus_lyrata1.jpg',
      sourcePage: 'https://commons.wikimedia.org/wiki/File:Ficus_lyrata1.jpg',
      isFavorite: false,
    },
  ]);

  // Signal for the search term
  // searchTerm = signal('');

  // Computed signal that filters products based on search term
  // filteredProducts = computed(() => {
  //   const term = this.searchTerm().toLowerCase().trim();
  //   if (!term) {
  //     return this.products();
  //   }
  //   return this.products().filter((product) =>
  //     product.name.toLowerCase().includes(term)
  //   );
  // });

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
  // eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
  onSearchChange(value: string): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onLoadMore(): void {}
}
