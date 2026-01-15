import {
  computed,
  inject,
  Injectable,
  linkedSignal,
  signal,
} from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductsApi } from '@workshop/catalogue-data-access';
import { ProductsResponse } from '@workshop/catalogue-types';
import { PageableResponse } from '@workshop/shared-types';

@Injectable()
export class CatalogueLocalState {
  private readonly productsApi = inject(ProductsApi);
  private mockProducts = signal<ProductsResponse[]>([
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
      plantType: 'Indoor',
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
      plantType: 'Indoor',
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
      plantType: 'Outdoor',
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
      plantType: 'Outdoor',
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
      plantType: 'Indoor',
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
      plantType: 'Indoor',
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
      plantType: 'Indoor',
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
      plantType: 'Indoor',
    },
  ]);

  // Use a computed signal to derive the total number of products
  totalProducts = signal(70);
  searchTerm = signal('');
  page = signal(0);

  products = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) {
      return this.mockProducts();
    }
    return this.mockProducts().filter((product) =>
      product.name.toLowerCase().includes(term)
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
