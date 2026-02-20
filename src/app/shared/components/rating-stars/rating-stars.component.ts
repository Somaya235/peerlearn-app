import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating-stars.html',
  styleUrls: ['./rating-stars.scss']
})
export class RatingStarsComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = true;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  stars: number[] = [1, 2, 3, 4, 5];

  getStarClass(star: number): string {
    const baseClass = `star ${this.size}`;
    
    if (star <= this.rating) {
      return `${baseClass} filled`;
    } else if (star - 0.5 <= this.rating) {
      return `${baseClass} half`;
    }
    return `${baseClass} empty`;
  }

  onStarClick(star: number): void {
    if (!this.readonly) {
      this.rating = star;
    }
  }
}
