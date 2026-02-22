import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../models/user.model';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly SESSION_KEY = 'oqp_session';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isBrowser: boolean;

  constructor(
    private userService: UserService
  ) {
    const platformId = inject(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      const session = localStorage.getItem(this.SESSION_KEY);
      if (session) {
        this.currentUserSubject.next(JSON.parse(session));
      }
    }
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<boolean> {
    const users = this.userService.getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      const { password, ...userWithoutPassword } = user;
      if (this.isBrowser) {
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(userWithoutPassword));
      }
      this.currentUserSubject.next(userWithoutPassword as User);
      return of(true);
    }

    return of(false);
  }

  register(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }): Observable<boolean> {
    const existingUser = this.userService.findByEmail(userData.email);
    if (existingUser) {
      return of(false);
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.userService.saveUser(newUser);
    
    const { password, ...userWithoutPassword } = newUser;
    if (this.isBrowser) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(userWithoutPassword));
    }
    this.currentUserSubject.next(userWithoutPassword as User);
    
    return of(true);
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(this.SESSION_KEY);
    }
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateProfile(updatedUser: User): void {
    const { password, ...userWithoutPassword } = updatedUser;
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(userWithoutPassword));
    this.currentUserSubject.next(userWithoutPassword as User);
    this.userService.updateUser(updatedUser);
  }
}
