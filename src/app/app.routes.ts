import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: () => import('./layout').then((m) => m.DefaultLayoutComponent),
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/pages/dashboard/dashboard').then((m) => m.Dashboard),
        data: {
          title: 'Dashboard',
        },
      },
      {
        path: 'categorias',
        loadComponent: () => import('./category/pages/category/category').then((m) => m.Category),
        data: {
          title: 'Categoria',
        },
      },
    ],
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
    data: {
      title: 'Login Page',
    },
  },
  { path: '**', redirectTo: 'dashboard' },
];
