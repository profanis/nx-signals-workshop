import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeroComponent } from '@workspace/shared/ui/ui-hero';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

interface CategoryCard {
  title: string;
  description: string;
  imageUrl: string;
}

@Component({
  selector: 'app-home-page',
  imports: [
    HeroComponent,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  private router = Router;

  categories: CategoryCard[] = [
    {
      title: 'Modern Art',
      description: 'Discover contemporary masterpieces',
      imageUrl: 'https://picsum.photos/seed/modern/400/300',
    },
    {
      title: 'Classic Paintings',
      description: 'Explore timeless works of art',
      imageUrl: 'https://picsum.photos/seed/classic/400/300',
    },
    {
      title: 'Photography',
      description: 'Browse stunning photo collections',
      imageUrl: 'https://picsum.photos/seed/photo/400/300',
    },
  ];

  onHeroCtaClick(): void {
    console.log('Hero CTA clicked - Navigate to catalogue');
    // Mock navigation to catalogue page
    // this.router.navigate(['/catalogue']);
  }

  onCategoryClick(category: CategoryCard): void {
    console.log('Category clicked:', category.title);
    // Mock navigation to catalogue page with category filter
    // this.router.navigate(['/catalogue'], { queryParams: { category: category.title } });
  }

  onSubscribe(): void {
    console.log('Newsletter subscription requested');
    // Mock newsletter subscription logic
  }
}
