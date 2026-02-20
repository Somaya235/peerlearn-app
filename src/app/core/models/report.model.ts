export interface Report {
  id: string;
  reporterId: string;
  reportedUserId: string;
  sessionId?: string;
  reason: 'inappropriate-behavior' | 'no-show' | 'fraud' | 'other';
  description: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateReportRequest {
  reportedUserId: string;
  sessionId?: string;
  reason: 'inappropriate-behavior' | 'no-show' | 'fraud' | 'other';
  description: string;
}
