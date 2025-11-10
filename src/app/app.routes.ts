import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./layout').then(m => m.DefaultLayoutComponent),
    data: {
      title: 'Home'
    }
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },
  { path: '**', redirectTo: 'dashboard' }
];
