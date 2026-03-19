import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Session, CreateSessionRequest } from '../models/session.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly SESSIONS_KEY = 'peerlearn_sessions';
  private isBrowser: boolean;

  constructor() {
    const platformId = inject(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getStoredSessions(): Session[] {
    if (!this.isBrowser) return [];
    const sessions = localStorage.getItem(this.SESSIONS_KEY);
    return sessions ? JSON.parse(sessions) : [];
  }

  private saveSessions(sessions: Session[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));
  }

  getSessions(): Promise<Session[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sessions = this.getStoredSessions();
        resolve(sessions);
      }, 100);
    });
  }

  getAvailableSessions(): Promise<Session[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sessions = this.getStoredSessions();
        // Only return scheduled sessions that haven't passed
        const availableSessions = sessions.filter(session => 
          session.status === 'scheduled' && 
          new Date(session.scheduledDate) > new Date()
        );
        resolve(availableSessions);
      }, 100);
    });
  }

  getSessionById(id: string): Promise<Session | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sessions = this.getStoredSessions();
        const session = sessions.find(s => s.id === id);
        resolve(session || null);
      }, 100);
    });
  }

  createSession(sessionData: CreateSessionRequest, tutorId: string, tutorName: string, tutorAvatar?: string): Promise<Session> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSession: Session = {
          id: Date.now().toString(),
          tutorId: tutorId,
          tutorName: tutorName,
          tutorAvatar: tutorAvatar || 'https://i.pravatar.cc/100',
          currentParticipants: 0,
          status: 'scheduled',
          createdAt: new Date(),
          updatedAt: new Date(),
          ...sessionData
        };

        // Store in localStorage
        const sessions = this.getStoredSessions();
        sessions.push(newSession);
        this.saveSessions(sessions);

        console.log('Session created:', newSession);
        resolve(newSession);
      }, 500);
    });
  }

  updateSession(id: string, sessionData: Partial<Session>): Promise<Session> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const sessions = this.getStoredSessions();
          const index = sessions.findIndex(s => s.id === id);
          
          if (index === -1) {
            reject(new Error('Session not found'));
            return;
          }

          const updatedSession: Session = {
            ...sessions[index],
            ...sessionData,
            updatedAt: new Date()
          };

          sessions[index] = updatedSession;
          this.saveSessions(sessions);

          console.log('Session updated:', updatedSession);
          resolve(updatedSession);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }

  deleteSession(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sessions = this.getStoredSessions();
        const filteredSessions = sessions.filter(s => s.id !== id);
        this.saveSessions(filteredSessions);
        console.log('Session deleted:', id);
        resolve(true);
      }, 500);
    });
  }

  joinSession(sessionId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const sessions = this.getStoredSessions();
          const sessionIndex = sessions.findIndex(s => s.id === sessionId);
          
          if (sessionIndex === -1) {
            reject(new Error('Session not found'));
            return;
          }

          const session = sessions[sessionIndex];
          if (session.currentParticipants >= session.maxParticipants) {
            reject(new Error('Session is full'));
            return;
          }

          session.currentParticipants++;
          session.updatedAt = new Date();
          
          sessions[sessionIndex] = session;
          this.saveSessions(sessions);

          console.log('Joined session:', sessionId);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }

  leaveSession(sessionId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const sessions = this.getStoredSessions();
          const sessionIndex = sessions.findIndex(s => s.id === sessionId);
          
          if (sessionIndex === -1) {
            reject(new Error('Session not found'));
            return;
          }

          const session = sessions[sessionIndex];
          if (session.currentParticipants > 0) {
            session.currentParticipants--;
          }
          session.updatedAt = new Date();
          
          sessions[sessionIndex] = session;
          this.saveSessions(sessions);

          console.log('Left session:', sessionId);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      }, 500);
    });
  }
}
