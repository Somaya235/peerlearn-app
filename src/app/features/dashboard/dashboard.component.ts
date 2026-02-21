import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SessionCardComponent } from '../../shared/components/session-card/session-card.component';
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';
import { Session } from '../../core/models/session.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SessionCardComponent, UserCardComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent {
  currentUser: any;

  // Mock sessions data
  sessions: Session[] = [
    {
      id: '1',
      title: 'Data Structures & Algorithms – Trees & Graphs',
      description: 'Learn about tree and graph data structures',
      subject: 'Computer Science',
      tutorId: 't1',
      tutorName: 'Nour El-Din',
      tutorAvatar: 'assets/avatar.jpg',
      rating: 4.9,
      maxParticipants: 15,
      currentParticipants: 8,
      scheduledDate: new Date('2024-10-26T16:00:00'),
      duration: 60,
      isOnline: true,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      title: 'Organic Chemistry – Reaction Mechanisms',
      description: 'Understanding organic reaction mechanisms',
      subject: 'Chemistry',
      tutorId: 't2',
      tutorName: 'Sarah Ali',
      tutorAvatar: 'assets/avatar.jpg',
      rating: 4.8,
      maxParticipants: 15,
      currentParticipants: 6,
      scheduledDate: new Date('2024-10-27T14:00:00'),
      duration: 90,
      isOnline: true,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      title: 'Calculus II – Integration Techniques',
      description: 'Advanced integration methods',
      subject: 'Mathematics',
      tutorId: 't3',
      tutorName: 'Ahmed Khaled',
      tutorAvatar: 'assets/avatar.jpg',
      rating: 4.7,
      maxParticipants: 15,
      currentParticipants: 12,
      scheduledDate: new Date('2024-10-28T10:00:00'),
      duration: 120,
      isOnline: true,
      status: 'scheduled',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Mock top tutors data
  topTutors: User[] = [
    {
      id: 't3',
      fullName: 'Ahmed Khaled',
      email: 'ahmed@university.edu',
      universityName: 'University of Science',
      avatar: 'assets/avatar.jpg',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 't2',
      fullName: 'Sarah Ali',
      email: 'sarah@university.edu',
      universityName: 'University of Chemistry',
      avatar: 'assets/avatar.jpg',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 't1',
      fullName: 'Nour El-Din',
      email: 'nour@university.edu',
      universityName: 'Computer Science Dept',
      avatar: 'assets/avatar.jpg',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
