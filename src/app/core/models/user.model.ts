export interface User {
  id: string;
  fullName: string;
  email: string;
  password?: string;
  universityName?: string;
  major?: string;
  subjectsGoodAt?: string[];
  subjectsNeedHelp?: string[];
  bio?: string;
  linkedIn?: string;
  avatar?: string;
  isVerified: boolean;
  rating?: number;
  totalRatings?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRegistration {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  universityName?: string;
  major?: string;
  subjectsGoodAt?: string;
  subjectsNeedHelp?: string;
  bio?: string;
  linkedIn?: string;
}
