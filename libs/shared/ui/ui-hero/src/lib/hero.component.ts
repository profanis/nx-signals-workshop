import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-ui-hero',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  title = input<string>('');
  subtitle = input<string>('');
  ctaText = input<string>('');

  ctaClick = output<void>();

  onCtaClick(): void {
    this.ctaClick.emit();
  }
}
