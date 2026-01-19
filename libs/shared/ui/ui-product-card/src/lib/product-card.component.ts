import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  IMAGE_LOADER,
  ImageLoaderConfig,
  NgOptimizedImage,
} from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsResponse } from '@workshop/catalogue-types';
@Component({
  selector: 'lib-ui-product-card',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgOptimizedImage,
    RouterLink,
  ],
  providers: [
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `https://res.cloudinary.com/drrogxjes/image/fetch/w_${config.width},h_300,c_fill,f_auto,q_auto/${config.src}`;
      },
    },
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCardComponent {
  product = input.required<ProductsResponse>();
  toggleFavorite = output<string>();

  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    this.toggleFavorite.emit(this.product().id);
  }
}
