import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-card.html',
  styleUrls: ['./user-card.scss']
})
export class UserCardComponent {
  @Input() user!: User;
  @Output() userClick = new EventEmitter<User>();

  onClick(): void {
    this.userClick.emit(this.user);
  }

  getRatingStars(rating?: number): string[] {
    const stars = [];
    const ratingValue = rating || 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= ratingValue) {
        stars.push('filled');
      } else if (i - 0.5 <= ratingValue) {
        stars.push('half');
      } else {
        stars.push('empty');
      }
    }
    
    return stars;
  }
}
