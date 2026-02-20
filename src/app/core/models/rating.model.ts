export interface Rating {
  id: string;
  sessionId: string;
  tutorId: string;
  studentId: string;
  rating: number; // 1-5 stars
  comment?: string;
  createdAt: Date;
}

export interface CreateRatingRequest {
  sessionId: string;
  tutorId: string;
  rating: number;
  comment?: string;
}
