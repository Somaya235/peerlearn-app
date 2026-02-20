import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { User } from '../models/user.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USERS_KEY = 'peerlearn_users';
  private isBrowser: boolean;

  constructor() {
    const platformId = inject(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  getUsers(): User[] {
    if (!this.isBrowser) return [];
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  saveUser(user: User): void {
    if (!this.isBrowser) return;
    const users = this.getUsers();
    const existingIndex = users.findIndex(u => u.email === user.email);
    
    if (existingIndex >= 0) {
      users[existingIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  updateUser(updatedUser: User): void {
    if (!this.isBrowser) return;
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    
    if (index >= 0) {
      users[index] = updatedUser;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    }
  }

  findByEmail(email: string): User | undefined {
    if (!this.isBrowser) return undefined;
    const users = this.getUsers();
    return users.find(u => u.email === email);
  }
}
