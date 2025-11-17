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
      {
        path: 'empresas',
        loadComponent: () => import('./organization/pages/organization.page').then((m) => m.OrganizationPage),
        data: {
          title: 'Empresa',
        },
      },
      {
        path: 'companias',
        loadComponent: () => import('./company/pages/company/company.page').then((m) => m.CompanyPage),
        data: {
          title: 'Compania',
        },
      },
      {
        path: 'documentos',
        loadComponent: () => import('./document/pages/document.page').then((m) => m.DocumentPage),
        data: {
          title: 'Documento',
        },
      },
      {
        path: 'monedas',
        loadComponent: () => import('./currency/pages/currency.page').then((m) => m.CurrencyPage),
        data: {
          title: 'Moneda',
        },
      },
      {
        path: 'productos',
        loadComponent: () => import('./products/pages/products/products').then((m) => m.Products),
        data: {
          title: 'Producto',
        },
      },
      {
        path: 'sucursales',
        loadComponent: () => import('./sucursal/pages/sucursal/sucursal').then((m) => m.Sucursal),
        data: {
          title: 'Sucursal',
        },
      },
      {
        path: 'unidad-medida',
        loadComponent: () => import('./unit-of-measure/pages/view/unit-of-measure.component').then((m) => m.UnitOfMeasurePage),
        data: {
          title: 'Unidad de Medida',
        },
      }
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
