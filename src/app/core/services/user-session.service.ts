import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { Session } from '../models/session.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserSessionService {
  private readonly JOINED_SESSIONS_KEY = 'peerlearn_joined_sessions';
  private isBrowser: boolean;

  // Track joined sessions using signal for reactivity
  private joinedSessions = signal<Set<string>>(new Set());

  // Expose joined sessions as a readonly signal
  readonly joinedSessions$ = this.joinedSessions.asReadonly();

  constructor() {
    const platformId = inject(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadUserJoinedSessions();
  }

  private loadUserJoinedSessions(): void {
    if (!this.isBrowser) return;
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const storageKey = `${this.JOINED_SESSIONS_KEY}_${currentUser.id}`;
    const joinedSessionsData = localStorage.getItem(storageKey);
    
    if (joinedSessionsData) {
      const sessionIds = JSON.parse(joinedSessionsData);
      this.joinedSessions.set(new Set(sessionIds));
    }
  }

  private saveUserJoinedSessions(): void {
    if (!this.isBrowser) return;
    
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const storageKey = `${this.JOINED_SESSIONS_KEY}_${currentUser.id}`;
    const sessionIds = Array.from(this.joinedSessions$());
    localStorage.setItem(storageKey, JSON.stringify(sessionIds));
  }

  private getCurrentUser(): any {
    if (!this.isBrowser) return null;
    const userData = localStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
  }

  // Add session to joined sessions
  joinSession(sessionId: string): void {
    this.joinedSessions.update(current => {
      const newSet = new Set(current);
      newSet.add(sessionId);
      return newSet;
    });
    this.saveUserJoinedSessions();
  }

  // Remove session from joined sessions
  leaveSession(sessionId: string): void {
    this.joinedSessions.update(current => {
      const newSet = new Set(current);
      newSet.delete(sessionId);
      return newSet;
    });
    this.saveUserJoinedSessions();
  }

  // Check if user has joined a session
  hasJoinedSession(sessionId: string): boolean {
    return this.joinedSessions$().has(sessionId);
  }

  // Get all joined session IDs
  getJoinedSessionIds(): string[] {
    return Array.from(this.joinedSessions$());
  }

  // Clear all joined sessions (for logout)
  clearJoinedSessions(): void {
    this.joinedSessions.set(new Set());
    this.saveUserJoinedSessions();
  }

  // Reload joined sessions (for user switch)
  reloadJoinedSessions(): void {
    this.loadUserJoinedSessions();
  }
}
