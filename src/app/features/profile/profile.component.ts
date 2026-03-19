import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../core/services/auth.service';
import { UserService } from './../../core/services/user.service';
import { RatingService } from './../../core/services/rating.service';
import { Rating } from './../../core/models/rating.model';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FeedbackModalComponent } from '../../shared/components/feedback-modal/feedback-modal.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule, FeedbackModalComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  currentUser: any;
  profileUser: any; // The user whose profile is being viewed
  isEditMode: boolean = false;
  editForm!: FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';
  showFeedbackModal: boolean = false;

  @ViewChild('feedbackModal') feedbackModal!: FeedbackModalComponent;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private userService: UserService,
    private ratingService: RatingService,
    private route: ActivatedRoute
  ) {
    this.currentUser = this.authService.getCurrentUser() as any;
    this.initializeForm();
  }

  ngOnInit(): void {
    this.loadProfileUser();
  }

  ngAfterViewInit(): void {
    console.log('ngAfterViewInit called');
    console.log('showFeedbackModal boolean:', this.showFeedbackModal);
  }

  loadProfileUser(): void {
    // Check if there's a userId query parameter
    this.route.queryParams.subscribe(params => {
      const userId = params['userId'];
      
      if (userId) {
        // Load specific user's profile
        this.profileUser = this.userService.getUsers().find(user => user.id === userId);
        console.log('Loading profile for user:', this.profileUser);
        
        if (!this.profileUser) {
          console.error('User not found with ID:', userId);
          // Fallback to current user
          this.profileUser = this.currentUser;
        }
      } else {
        // Load current user's profile
        this.profileUser = this.currentUser;
        console.log('Loading current user profile');
      }
      
      if (this.profileUser) {
        this.initializeForm();
        this.loadReviews(); // Reload reviews when profile user changes
      } else {
        console.error('No profile user available');
        this.reviews = [];
      }
    });
  }

  async loadReviews(): Promise<void> {
    if (!this.profileUser || !this.profileUser.id) {
      console.log('No profile user or user ID available, skipping reviews load');
      this.reviews = [];
      return;
    }
    
    try {
      this.reviews = await this.ratingService.getRatingsForTutor(this.profileUser.id);
      console.log('Loaded reviews for profile:', this.reviews);
    } catch (error) {
      console.error('Error loading reviews:', error);
      this.reviews = [];
    }
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      fullName: [this.profileUser?.fullName || '', Validators.required],
      universityName: [this.profileUser?.universityName || ''],
      major: [this.profileUser?.major || ''],
      bio: [this.profileUser?.bio || ''],
      subjectsGoodAt: [this.profileUser?.subjectsGoodAt?.join(', ') || ''],
      subjectsNeedHelp: [this.profileUser?.subjectsNeedHelp?.join(', ') || '']
    });
  }

  get user() {
    return this.profileUser || {
      fullName: 'Guest User',
      major: 'Not specified',
      universityName: 'Not specified',
      rating: 0,
      sessions: 0,
      reviews: 0,
      points: 0,
      bio: 'No bio available',
      availableTimes: []
    };
  }

  get canEditProfile(): boolean {
    // Only allow editing if viewing your own profile
    return this.currentUser && this.profileUser && this.currentUser.id === this.profileUser.id;
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.initializeForm();
      this.successMessage = '';
    }
  }

  saveProfile(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';

    const updatedUser = {
      ...this.currentUser,
      ...this.editForm.value,
      subjectsGoodAt: this.editForm.value.subjectsGoodAt 
        ? this.editForm.value.subjectsGoodAt.split(',').map((s: string) => s.trim()).filter((s: string) => s)
        : [],
      subjectsNeedHelp: this.editForm.value.subjectsNeedHelp
        ? this.editForm.value.subjectsNeedHelp.split(',').map((s: string) => s.trim()).filter((s: string) => s)
        : [],
      updatedAt: new Date()
    };

    this.authService.updateProfile(updatedUser);
    this.currentUser = updatedUser;
    this.isEditMode = false;
    this.successMessage = 'Profile updated successfully!';
    this.isLoading = false;
  }

  cancelEdit(): void {
    this.isEditMode = false;
    this.initializeForm();
  }

  reviews: Rating[] = [];

  // Helper method to format student name from studentId
  getStudentName(studentId: string): string {
    const currentUser = this.authService.getCurrentUser();
    
    // If it's the current user's feedback, show their name
    if (currentUser && studentId === currentUser.id) {
      return currentUser.fullName || 'You';
    }
    
    // Try to find the user from UserService
    const user = this.userService.getUsers().find(u => u.id === studentId);
    if (user) {
      return user.fullName;
    }
    
    // Otherwise use predefined names or fallback
    const names: { [key: string]: string } = {
      'ahmed-khaled': 'Ahmed Khaled',
      'sarah-ali': 'Sarah Ali'
    };
    return names[studentId] || studentId;
  }

  // Helper method to format date
  formatDate(date: Date | string): string {
    const now = new Date();
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    if (isNaN(dateObj.getTime())) {
      return 'Unknown date';
    }
    
    const diffTime = now.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  openFeedbackModal(): void {
    console.log('=== OPEN FEEDBACK MODAL DEBUG ===');
    console.log('openFeedbackModal called');
    console.log('feedbackModal ViewChild:', this.feedbackModal);
    
    if (this.feedbackModal) {
      console.log('Calling feedbackModal.open()');
      this.feedbackModal.open();
      console.log('feedbackModal.open() called successfully');
    } else {
      console.error('Feedback modal ViewChild not found');
    }
  }

  closeFeedbackModal(): void {
    console.log('=== CLOSE FEEDBACK MODAL DEBUG ===');
    console.log('closeFeedbackModal called');
    this.showFeedbackModal = false;
    console.log('showFeedbackModal is now:', this.showFeedbackModal);
  }

  // Method to handle new feedback submission
  async onFeedbackSubmitted(newFeedback: { rating: number; comment: string }): Promise<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !this.profileUser || !this.profileUser.id) {
      console.error('Cannot submit feedback: missing user or profile data');
      return;
    }

    try {
      // Create rating data
      const ratingData = {
        sessionId: 'profile-visit', // Profile visit feedback
        tutorId: this.profileUser.id, // Profile owner's ID
        rating: newFeedback.rating,
        comment: newFeedback.comment
      };

      // Save rating using RatingService
      await this.ratingService.createRating(ratingData, currentUser.id);
      
      // Reload reviews to show new feedback
      await this.loadReviews();
      
      console.log('Feedback submitted successfully');
      
      // Close modal after successful submission
      setTimeout(() => {
        this.closeFeedbackModal();
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  }
}
