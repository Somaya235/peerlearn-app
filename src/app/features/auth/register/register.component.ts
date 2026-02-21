import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,RouterLink],
  templateUrl: './register.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  currentStep: number = 1;
  isLoading: boolean = false;
  errorMessage: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],

      universityName: [''],
      major: [''],
      subjectsGoodAt: [''],
      subjectsNeedHelp: [''],

      bio: [''],
      linkedIn: ['']
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  nextStep(): void {
    this.errorMessage = ''; // Clear error when attempting to proceed
    if (this.validateCurrentStep()) {
      if (this.currentStep < 3) {
        this.currentStep++;
      }
    }
  }

  prevStep(): void {
    this.errorMessage = ''; // Clear error when going back
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  private validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        const fullName = this.registerForm.get('fullName');
        const email = this.registerForm.get('email');
        const password = this.registerForm.get('password');
        const confirmPassword = this.registerForm.get('confirmPassword');
        
        if (!fullName?.valid || !email?.valid || !password?.valid || !confirmPassword?.valid) {
          if (!password?.valid) {
            this.errorMessage = 'Password must be at least 6 characters long';
          } else {
            this.errorMessage = 'Please fill in all required fields correctly';
          }
          this.registerForm.markAllAsTouched();
          return false;
        }
        
        // Check if email already exists
        if (this.userService.findByEmail(email.value)) {
          this.errorMessage = 'This email is already registered. Please use a different email or log in.';
          return false;
        }
        
        if (password.value !== confirmPassword.value) {
          this.errorMessage = 'Passwords do not match';
          return false;
        }
        
        return true;
        
      case 2:
        // Academic info is optional
        return true;
        
      case 3:
        // Profile info is optional
        return true;
        
      default:
        return true;
    }
  }

  async completeProfile(): Promise<void> {
    if (!this.validateCurrentStep()) return;
    
    this.isLoading = true;
    this.errorMessage = '';
    
    try {
      const result = await firstValueFrom(this.authService.register({
        fullName: this.registerForm.value.fullName!,
        email: this.registerForm.value.email!,
        password: this.registerForm.value.password!,
        universityName: this.registerForm.value.universityName || undefined,
        major: this.registerForm.value.major || undefined,
        subjectsGoodAt: this.registerForm.value.subjectsGoodAt ? this.registerForm.value.subjectsGoodAt.split(',').map((s: string) => s.trim()) : [],
        subjectsNeedHelp: this.registerForm.value.subjectsNeedHelp ? this.registerForm.value.subjectsNeedHelp.split(',').map((s: string) => s.trim()) : [],
        bio: this.registerForm.value.bio || undefined,
        linkedIn: this.registerForm.value.linkedIn || undefined,
        avatar: undefined,
        isVerified: true,
        rating: 0,
        totalRatings: 0
      }));
      
      if (result) {
        // Navigate to login (clear any existing session first)
        this.authService.logout();
        this.router.navigate(['/login']);
      } else {
        this.errorMessage = 'Registration failed. Email already exists or invalid data.';
      }
    } catch (error) {
      this.errorMessage = 'Registration failed. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
