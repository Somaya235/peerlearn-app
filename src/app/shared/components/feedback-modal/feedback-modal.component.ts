import { Component, inject, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Rating } from '../../../core/models/rating.model';
import { RatingService } from '../../../core/services/rating.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-feedback-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss']
})
export class FeedbackModalComponent implements OnInit {
  feedbackForm: FormGroup;
  isLoading: boolean = false;
  showSuccess: boolean = false;
  errorMessage: string = '';

  @Input() set isVisible(value: boolean) {
    console.log('=== FEEDBACK MODAL SETTER DEBUG ===');
    console.log('isVisible setter called with:', value);
    this._isVisible = value;
    if (value) {
      console.log('Resetting form because isVisible is true');
      this.resetForm();
    }
  }

  get isVisible(): boolean {
    return this._isVisible;
  }

  private _isVisible: boolean = false;

  @Output() feedbackSubmitted = new EventEmitter<{ rating: number; comment: string }>();
  @Output() closeModal = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private ratingService = inject(RatingService);
  private authService = inject(AuthService);

  constructor() {
    this.feedbackForm = this.fb.group({
      rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {}

  open(): void {
    console.log('=== FEEDBACK MODAL OPEN DEBUG ===');
    console.log('open() called');
    console.log('Current isVisible:', this.isVisible);
    this._isVisible = true;
    console.log('Set _isVisible to:', this._isVisible);
    this.resetForm();
    console.log('Form reset completed');
  }

  close(): void {
    console.log('Feedback modal close() called');
    this._isVisible = false;
    this.resetForm();
    console.log('Modal visibility set to:', this._isVisible);
    this.closeModal.emit();
  }

  private resetForm(): void {
    this.feedbackForm.reset({
      rating: 5,
      comment: ''
    });
    this.errorMessage = '';
    this.showSuccess = false;
  }

  async submitFeedback(): Promise<void> {
    if (this.feedbackForm.invalid || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const feedbackData = {
        rating: this.feedbackForm.value.rating,
        comment: this.feedbackForm.value.comment
      };

      console.log('Submitting feedback:', feedbackData);

      // Emit the feedback data to parent component
      this.feedbackSubmitted.emit(feedbackData);

      // Show success message
      this.showSuccess = true;
      
      // Close modal after delay
      console.log('Setting timer to close modal in 2 seconds...');
      setTimeout(() => {
        console.log('Timer triggered - calling close()');
        this.close();
      }, 2000);

    } catch (error) {
      this.errorMessage = 'Failed to submit feedback. Please try again.';
      console.error('Feedback submission error:', error);
    } finally {
      this.isLoading = false;
    }
  }

  get rating() {
    return this.feedbackForm.get('rating');
  }

  get comment() {
    return this.feedbackForm.get('comment');
  }

  // Helper method to generate star rating display
  getStars(rating: number): boolean[] {
    return [1, 2, 3, 4, 5].map(star => star <= rating);
  }

  // Method to handle star click
  setRating(value: number): void {
    this.rating?.setValue(value);
  }
}
