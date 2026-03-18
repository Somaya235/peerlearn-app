import { Component, inject, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Session } from '../../../core/models/session.model';
import { SessionService } from '../../../core/services/session.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-session-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-details-modal.component.html',
  styleUrls: ['./session-details-modal.component.scss']
})
export class SessionDetailsModalComponent {
  session: Session | null = null;
  isVisible: boolean = false;
  isLoading: boolean = false;
  currentUser: any;
  private joinedSessions: Set<string> = new Set();

  private sessionService = inject(SessionService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    this.currentUser = this.authService.getCurrentUser();
  }

  open(session: Session): void {
    this.session = session;
    this.isVisible = true;
    // Check if user already joined this session (for persistence across modal opens)
    // In a real app, this would come from backend
    // For now, we'll track it locally
  }

  close(): void {
    this.isVisible = false;
    this.session = null;
  }

  async joinSession(): Promise<void> {
    if (!this.session || this.isLoading) return;

    console.log('Join session clicked', this.session.id);
    this.isLoading = true;
    this.cdr.detectChanges(); // Force immediate UI update
    
    try {
      const result = await this.sessionService.joinSession(this.session.id);
      console.log('Join session result:', result);
      if (result) {
        // Track that user joined this session
        this.joinedSessions.add(this.session.id);
        // Update session participants
        this.session.currentParticipants++;
      }
    } catch (error) {
      console.error('Failed to join session:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges(); // Force UI update
      console.log('Join session completed, loading set to false');
      console.log('Joined sessions:', this.joinedSessions);
    }
  }

  async leaveSession(): Promise<void> {
    if (!this.session || this.isLoading) return;

    this.isLoading = true;
    this.cdr.detectChanges(); // Force immediate UI update
    
    try {
      const result = await this.sessionService.leaveSession(this.session.id);
      if (result) {
        // Remove from joined sessions tracking
        this.joinedSessions.delete(this.session.id);
        // Update session participants
        this.session.currentParticipants--;
      }
    } catch (error) {
      console.error('Failed to leave session:', error);
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges(); // Force UI update
      console.log('Leave session completed, loading set to false');
      console.log('Joined sessions after leave:', this.joinedSessions);
    }
  }

  isUserJoined(): boolean {
    if (!this.session || !this.currentUser) return false;
    return this.joinedSessions.has(this.session.id);
  }

  isUserCreator(): boolean {
    if (!this.session || !this.currentUser) return false;
    return this.session.tutorId === this.currentUser.id;
  }

  getAvailableSeats(): number {
    if (!this.session) return 0;
    return this.session.maxParticipants - this.session.currentParticipants;
  }

  getOccupancyPercentage(): number {
    if (!this.session) return 0;
    return (this.session.currentParticipants / this.session.maxParticipants) * 100;
  }

  isSessionFull(): boolean {
    if (!this.session) return false;
    return this.session.currentParticipants >= this.session.maxParticipants;
  }
}
