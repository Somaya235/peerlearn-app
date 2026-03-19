import { Component, inject, OnInit, ViewChild, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Session } from '../../core/models/session.model';
import { SessionService } from '../../core/services/session.service';
import { AuthService } from '../../core/services/auth.service';
import { UserSessionService } from '../../core/services/user-session.service';
import { SessionCardComponent } from '../../shared/components/session-card/session-card.component';
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { CreateSessionModalComponent } from '../../shared/components/create-session-modal/create-session-modal.component';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, SessionCardComponent, NavbarComponent, CreateSessionModalComponent],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  createdSessions: Session[] = [];
  joinedSessions: Session[] = [];
  allSessions: Session[] = []; // Store all sessions for reactive updates
  activeTab: 'created' | 'joined' = 'created';
  isLoading: boolean = false;
  currentUser: any;

  @ViewChild('createSessionModal') createSessionModal!: CreateSessionModalComponent;

  private sessionService = inject(SessionService);
  private authService = inject(AuthService);
  private userSessionService = inject(UserSessionService);
  private router = inject(Router);

  constructor() {
    // Set up reactive effect to monitor joined sessions changes
    effect(() => {
      const joinedSessionIds = Array.from(this.userSessionService.joinedSessions$());
      this.updateJoinedSessions(joinedSessionIds);
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSessions();
    // Reload joined sessions for current user
    this.userSessionService.reloadJoinedSessions();
  }

  async loadSessions(): Promise<void> {
    try {
      this.isLoading = true;
      const userId = this.currentUser?.id;
      
      if (userId) {
        // Load all sessions and store for reactive updates
        this.allSessions = await this.sessionService.getSessions();
        
        // Filter created sessions (where user is tutor)
        this.createdSessions = this.allSessions.filter((session: Session) => session.tutorId === userId);
        
        // Load joined sessions from shared service
        const joinedSessionIds = this.userSessionService.getJoinedSessionIds();
        this.updateJoinedSessions(joinedSessionIds);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      this.isLoading = false;
    }
  }

  private updateJoinedSessions(joinedSessionIds: string[]): void {
    // Filter all sessions by joined session IDs
    this.joinedSessions = this.allSessions.filter((session: Session) => 
      joinedSessionIds.includes(session.id)
    );
    console.log('Current user:', this.currentUser?.id);
    console.log('Joined session IDs:', joinedSessionIds);
    console.log('Updated joined sessions:', this.joinedSessions);
    console.log('All available sessions:', this.allSessions);
  }

  switchTab(tab: 'created' | 'joined'): void {
    this.activeTab = tab;
  }

  refreshJoinedSessions(): void {
    // This method can be called when user joins/leaves a session
    this.loadSessions();
  }

  onSessionClick(session: Session): void {
    // For now, just log the session click
    console.log('Session clicked:', session.title);
    // TODO: Implement session details modal or navigation
  }

  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  openCreateSessionModal(): void {
    console.log('Opening create session modal from schedule page');
    if (this.createSessionModal) {
      this.createSessionModal.open();
    } else {
      console.error('Create session modal not found');
    }
  }

  async onSessionCreated(sessionData: any): Promise<void> {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        console.error('User not logged in');
        return;
      }

      const newSession = await this.sessionService.createSession(
        sessionData,
        currentUser.id,
        currentUser.fullName,
        currentUser.avatar
      );

      console.log('Session created successfully:', newSession);
      
      // Reload sessions to show the new one
      await this.loadSessions();
      
      // Switch to created tab to show the new session
      this.activeTab = 'created';
      
    } catch (error) {
      console.error('Error creating session:', error);
    }
  }

  get activeSessions(): Session[] {
    return this.activeTab === 'created' ? this.createdSessions : this.joinedSessions;
  }

  get hasSessions(): boolean {
    return this.activeSessions.length > 0;
  }
}
