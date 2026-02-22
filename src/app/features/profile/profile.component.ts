import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './../../core/services/auth.service';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, NavbarComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  currentUser: any;
  isEditMode: boolean = false;
  editForm!: FormGroup;
  isLoading: boolean = false;
  successMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser() as any;
    this.initializeForm();
  }

  initializeForm(): void {
    this.editForm = this.fb.group({
      fullName: [this.currentUser?.fullName || '', Validators.required],
      universityName: [this.currentUser?.universityName || ''],
      major: [this.currentUser?.major || ''],
      bio: [this.currentUser?.bio || ''],
      subjectsGoodAt: [this.currentUser?.subjectsGoodAt?.join(', ') || ''],
      subjectsNeedHelp: [this.currentUser?.subjectsNeedHelp?.join(', ') || '']
    });
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

  get user() {
    return this.currentUser || {
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

  sessions = [
    {
      title: 'Introduction to Macroeconomics',
      topic: 'Economics',
      tool: 'Zoom',
      seatsTaken: 6,
      seatsTotal: 10,
      available: true
    },
    {
      title: 'Understanding GDP & Economic Growth',
      topic: 'Economics',
      tool: 'Google Meet',
      seatsTaken: 8,
      seatsTotal: 10,
      available: false
    }
  ];

  reviews = [
    {
      name: 'Ahmed Khaled',
      rating: 4.5,
      comment: 'Excellent tutor! Clear explanations and very patient.',
      date: '2 days ago'
    },
    {
      name: 'Sarah Ali',
      rating: 4.0,
      comment: 'Great sessions, very knowledgeable.',
      date: '2 days ago'
    }
  ];
}
