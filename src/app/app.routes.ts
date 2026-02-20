import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  // لو المستخدم فتح الموقع من غير ما يكتب حاجة، وديه على شاشة الدخول
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // مسارات شاشة الدخول والتسجيل
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  { 
    path: 'register', 
    component: RegisterComponent,
    canActivate: [guestGuard]
  },
  
  // مسارات المحمية (تحتاج تسجيل دخول)
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  
  // TODO: Add protected routes after creating feature components
  // { path: 'sessions', component: SessionsListComponent, canActivate: [authGuard, verifiedGuard] },
  // { path: 'profile', component: ProfileViewComponent, canActivate: [authGuard, verifiedGuard] },
  // { path: 'reports', component: MySessionsComponent, canActivate: [authGuard, verifiedGuard] },
];