import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Rating, CreateRatingRequest } from '../models/rating.model';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private readonly RATINGS_KEY = 'peerlearn_ratings';
  private isBrowser: boolean;

  constructor() {
    const platformId = inject(PLATFORM_ID);
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getStoredRatings(): Rating[] {
    if (!this.isBrowser) return [];
    const ratings = localStorage.getItem(this.RATINGS_KEY);
    return ratings ? JSON.parse(ratings) : [];
  }

  private saveRatings(ratings: Rating[]): void {
    if (!this.isBrowser) return;
    localStorage.setItem(this.RATINGS_KEY, JSON.stringify(ratings));
  }

  createRating(ratingData: CreateRatingRequest, studentId: string): Promise<Rating> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRating: Rating = {
          id: Date.now().toString(),
          studentId: studentId,
          createdAt: new Date(),
          ...ratingData
        };

        // Store in localStorage
        const ratings = this.getStoredRatings();
        ratings.push(newRating);
        this.saveRatings(ratings);

        console.log('Rating saved:', newRating);
        resolve(newRating);
      }, 500);
    });
  }

  getRatingsForTutor(tutorId: string): Promise<Rating[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allRatings = this.getStoredRatings();
        const tutorRatings = allRatings.filter(rating => rating.tutorId === tutorId);
        console.log('Ratings for tutor', tutorId, ':', tutorRatings);
        resolve(tutorRatings);
      }, 500);
    });
  }

  getRatingsForSession(sessionId: string): Promise<Rating[]> {
    // TODO: Implement actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 500);
    });
  }

  updateRating(id: string, ratingData: Partial<Rating>): Promise<Rating> {
    // TODO: Implement actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedRating: Rating = {
          id: id,
          sessionId: ratingData.sessionId || '',
          tutorId: ratingData.tutorId || '',
          studentId: ratingData.studentId || '',
          rating: ratingData.rating || 5,
          createdAt: ratingData.createdAt || new Date(),
          ...ratingData
        };
        resolve(updatedRating);
      }, 500);
    });
  }

  deleteRating(id: string): Promise<boolean> {
    // TODO: Implement actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }
}
