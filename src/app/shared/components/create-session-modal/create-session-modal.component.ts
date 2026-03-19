import { Component, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface CreateSessionData {
  title: string;
  description: string;
  subject: string;
  maxParticipants: number;
  duration: number;
  scheduledDate: Date;
  isOnline: boolean;
}

@Component({
  selector: 'app-create-session-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-session-modal.component.html',
  styleUrls: ['./create-session-modal.component.scss']
})
export class CreateSessionModalComponent implements OnInit {
  sessionForm: FormGroup;
  isLoading: boolean = false;
  showSuccess: boolean = false;
  errorMessage: string = '';
  isVisible: boolean = false;

  @Output() sessionCreated = new EventEmitter<CreateSessionData>();
  @Output() closeModal = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  constructor() {
    this.sessionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      subject: ['', [Validators.required]],
      maxParticipants: [5, [Validators.required, Validators.min(1), Validators.max(50)]],
      duration: [60, [Validators.required, Validators.min(15), Validators.max(180)]],
      scheduledDate: ['', [Validators.required]],
      isOnline: [true]
    });
  }

  ngOnInit(): void {}

  open(): void {
    this.isVisible = true;
    this.resetForm();
  }

  close(): void {
    this.isVisible = false;
    this.resetForm();
    this.closeModal.emit();
  }

  private resetForm(): void {
    this.sessionForm.reset({
      title: '',
      description: '',
      subject: '',
      maxParticipants: 5,
      duration: 60,
      scheduledDate: '',
      isOnline: true
    });
    this.errorMessage = '';
    this.showSuccess = false;
  }

  async createSession(): Promise<void> {
    if (this.sessionForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const formData = this.sessionForm.value;
      
      const sessionData: CreateSessionData = {
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        maxParticipants: formData.maxParticipants,
        duration: formData.duration,
        scheduledDate: new Date(formData.scheduledDate),
        isOnline: formData.isOnline
      };

      console.log('Creating session:', sessionData);

      // Emit the session data to parent component
      this.sessionCreated.emit(sessionData);

      // Show success message
      this.showSuccess = true;
      
      // Close modal after delay
      setTimeout(() => {
        this.close();
      }, 2000);

    } catch (error) {
      this.errorMessage = 'Failed to create session. Please try again.';
      console.error('Session creation error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  get title() {
    return this.sessionForm.get('title');
  }

  get description() {
    return this.sessionForm.get('description');
  }

  get subject() {
    return this.sessionForm.get('subject');
  }

  get maxParticipants() {
    return this.sessionForm.get('maxParticipants');
  }

  get duration() {
    return this.sessionForm.get('duration');
  }

  get scheduledDate() {
    return this.sessionForm.get('scheduledDate');
  }

  // Helper method to format duration display
  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }

  // Common subjects for dropdown
  get commonSubjects(): string[] {
    return [
      'Mathematics',
      'Physics', 
      'Chemistry',
      'Biology',
      'Computer Science',
      'Engineering',
      'English',
      'History',
      'Economics',
      'Psychology',
      'Business',
      'Art & Design',
      'Music',
      'Languages',
      'Other'
    ];
  }
}
