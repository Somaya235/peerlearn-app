import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  currentUser: any;

  constructor() {
    this.currentUser = inject(AuthService).getCurrentUser() as any;
  }

  get user() {
    return this.currentUser || {
      fullName: 'Guest User',
      major: 'Not specified',
      university: 'Not specified',
      rating: 0,
      sessions: 0,
      reviews: 0,
      points: 0,
      about: 'No bio available',
      availableTimes: []
    };
  }

  sessions = [
    {
      title: 'Introduction to Macroeconomics',
      topic: 'Economics',
      tool: 'Zoom',
      seatsTaken: 6,
      seatsTotal: 10,
      available: true
    },
    {
      title: 'Understanding GDP & Economic Growth',
      topic: 'Economics',
      tool: 'Google Meet',
      seatsTaken: 8,
      seatsTotal: 10,
      available: false
    }
  ];

  reviews = [
    {
      name: 'Ahmed Khaled',
      rating: 4.5,
      comment: 'Excellent tutor! Clear explanations and very patient.',
      date: '2 days ago'
    },
    {
      name: 'Sarah Ali',
      rating: 4.0,
      comment: 'Great sessions, very knowledgeable.',
      date: '2 days ago'
    }
  ];
}
