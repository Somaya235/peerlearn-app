import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { SessionService } from '../../core/services/session.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { SessionCardComponent } from '../../shared/components/session-card/session-card.component';
import { UserCardComponent } from '../../shared/components/user-card/user-card.component';
import { SessionDetailsModalComponent } from '../sessions/session-details-modal/session-details-modal.component';
import { Session } from '../../core/models/session.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SessionCardComponent, UserCardComponent, SessionDetailsModalComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: any;
  topTutors: User[] = [];

  @ViewChild(SessionDetailsModalComponent) sessionDetailsModal!: SessionDetailsModalComponent;

  // Sessions data - loaded from SessionService
  sessions: Session[] = [];
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private sessionService: SessionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  async ngOnInit(): Promise<void> {
    await this.loadAvailableSessions();
    this.loadTopTutors();
  }

  async loadAvailableSessions(): Promise<void> {
    try {
      this.isLoading = true;
      this.cdr.detectChanges(); // Force template update
      
      // First try to get all sessions to see what data exists
      this.sessions = await this.sessionService.getSessions();
      console.log('All sessions in storage:', this.sessions);
      
      // If there are sessions but they're filtered out by getAvailableSessions, let's see why
      const availableSessions = await this.sessionService.getAvailableSessions();
      console.log('Available sessions (filtered):', availableSessions);
      
      // Use available sessions for display
      this.sessions = availableSessions;
      console.log('Final sessions to display:', this.sessions);
    } catch (error) {
      console.error('Error loading sessions:', error);
      this.sessions = [];
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges(); // Force template update to show sessions
      console.log('Loading finished, isLoading:', this.isLoading);
    }
  }

  loadTopTutors(): void {
    // Get all users from the service
    const allUsers = this.userService.getUsers();
    
    // Filter out current user and get top tutors (sorted by rating or just first few)
    this.topTutors = allUsers
      .filter(user => user.id !== this.currentUser?.id) // Exclude current user
      .sort((a, b) => (b.rating || 0) - (a.rating || 0)) // Sort by rating (highest first)
      .slice(0, 5); // Take top 5
    
    console.log('Top tutors loaded:', this.topTutors);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  onSessionClick(session: Session): void {
    this.sessionDetailsModal.open(session);
  }

  async refreshSessions(): Promise<void> {
    await this.loadAvailableSessions();
  }

  async createTestSession(): Promise<void> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        console.error('No current user');
        return;
      }

      const testSession = {
        title: 'Test Session - Dashboard Debug',
        description: 'This is a test session to verify dashboard functionality',
        subject: 'Computer Science',
        maxParticipants: 10,
        duration: 60,
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        isOnline: true
      };

      const newSession = await this.sessionService.createSession(
        testSession,
        currentUser.id,
        currentUser.fullName,
        currentUser.avatar
      );

      console.log('Test session created:', newSession);
      await this.loadAvailableSessions(); // Refresh the dashboard
    } catch (error) {
      console.error('Error creating test session:', error);
    }
  }

  onUserClick(user: User): void {
    // Navigate to the user's profile page
    // We'll need to create a profile route that accepts a user ID parameter
    console.log('Navigating to profile for user:', user);
    
    // For now, navigate to the current user's profile (we'll update this later)
    // In a real app, you'd navigate to `/profile/${user.id}` or similar
    this.router.navigate(['/profile'], { 
      queryParams: { userId: user.id } 
    });
  }
}
