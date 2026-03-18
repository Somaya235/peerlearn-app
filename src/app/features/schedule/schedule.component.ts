import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Session } from '../../core/models/session.model';
import { SessionService } from '../../core/services/session.service';
import { AuthService } from '../../core/services/auth.service';
import { SessionCardComponent } from '../../shared/components/session-card/session-card.component';
import { SessionDetailsModalComponent } from '../sessions/session-details-modal/session-details-modal.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, SessionCardComponent, SessionDetailsModalComponent, NavbarComponent],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  createdSessions: Session[] = [];
  joinedSessions: Session[] = [];
  isLoading: boolean = true;
  activeTab: 'created' | 'joined' = 'created';
  currentUser: any;

  @ViewChild(SessionDetailsModalComponent) sessionDetailsModal!: SessionDetailsModalComponent;

  private sessionService = inject(SessionService);
  private authService = inject(AuthService);

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSessions();
  }

  async loadSessions(): Promise<void> {
    try {
      this.isLoading = true;
      const userId = this.currentUser?.id;
      
      if (userId) {
        // Load all sessions and filter by user role
        const allSessions = await this.sessionService.getSessions();
        
        // Filter created sessions (where user is tutor)
        this.createdSessions = allSessions.filter(session => session.tutorId === userId);
        
        // For joined sessions, we'd need participant data - for now use empty array
        // This would need to be implemented based on your data structure
        this.joinedSessions = [];
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      this.isLoading = false;
    }
  }

  switchTab(tab: 'created' | 'joined'): void {
    this.activeTab = tab;
  }

  onSessionClick(session: Session): void {
    this.sessionDetailsModal.open(session);
  }

  get activeSessions(): Session[] {
    return this.activeTab === 'created' ? this.createdSessions : this.joinedSessions;
  }

  get hasSessions(): boolean {
    return this.activeSessions.length > 0;
  }
}
