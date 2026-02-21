export interface Session {
  id: string;
  title: string;
  description: string;
  subject: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  rating?: number;
  studentId?: string;
  studentName?: string;
  maxParticipants: number;
  currentParticipants: number;
  scheduledDate: Date;
  duration: number; // in minutes
  location?: string;
  isOnline: boolean;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSessionRequest {
  title: string;
  description: string;
  subject: string;
  maxParticipants: number;
  scheduledDate: Date;
  duration: number;
  location?: string;
  isOnline: boolean;
  price?: number;
}
