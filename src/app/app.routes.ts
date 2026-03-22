import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    canActivate: [authGuard],
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
        path: 'marcas',
        loadComponent: () => import('./brand/pages/brand/brand').then((m) => m.BrandComponent),
        data: {
          title: 'Marcas',
        },
      },
      {
        path: 'empresas',
        loadComponent: () =>
          import('./organization/pages/organization.page').then((m) => m.OrganizationPage),
        data: {
          title: 'Empresa',
        },
      },
      {
        path: 'tipo-documento',
        loadComponent: () =>
          import('./document-type/pages/document-type/document-type.component').then(
            (m) => m.DocumentTypeComponent,
          ),
        data: {
          title: 'Tipo Documentos',
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
        loadComponent: () =>
          import('./unit-of-measure/pages/view/unit-of-measure.component').then(
            (m) => m.UnitOfMeasurePage,
          ),
        data: {
          title: 'Unidad de Medida',
        },
      },
      {
        path: 'usuario',
        loadComponent: () => import('./user/pages/user/user.page').then((m) => m.UserPage),
        data: {
          title: 'Usuario',
        },
      },
      {
        path: 'rol',
        loadComponent: () => import('./rol/pages/rol/rol').then((m) => m.Rol),
        data: {
          title: 'Rol',
        },
      },
      {
        path: 'proveedores',
        loadComponent: () => import('./supplier/pages/supplier.page').then((m) => m.SupplierPage),
        data: {
          title: 'Proveedor',
        },
      },
      {
        path: 'clientes',
        loadComponent: () => import('./customer/pages/customer.page').then((m) => m.CustomerPage),
        data: {
          title: 'Cliente',
        },
      },
      {
        path: 'metodo-pago',
        loadComponent: () =>
          import('./payment-method/pages/payment-method-search/payment-method.component').then(
            (m) => m.PaymentMethodComponent,
          ),
        data: {
          title: 'Metodo de Pago',
        },
      },
      {
        path: 'compras',
        loadComponent: () =>
          import('./purchase/pages/new-purchase/new-purchase.component').then(
            (m) => m.NewPurchaseComponent,
          ),
        data: {
          title: 'Compra',
        },
      },
      {
        path: 'ver-compra/:id',
        loadComponent: () =>
          import('./purchase/pages/purchase-view/purchase-view.component').then(
            (m) => m.PurchaseViewComponent,
          ),
        data: {
          title: 'Ver Compra',
        },
      },
      {
        path: 'listado-compras',
        loadComponent: () =>
          import('./purchase/pages/purchase-search/purchase-search.page').then(
            (m) => m.PurchaseSearchPage,
          ),
        data: {
          title: 'Listado de Compras',
        },
      },
      {
        path: 'ventas',
        loadComponent: () =>
          import('./sales/pages/new-sale/new-sale.page').then((m) => m.NewSalePage),
        data: {
          title: 'Nueva Venta',
        },
      },
      {
        path: 'listado-ventas',
        loadComponent: () =>
          import('./sales/pages/sales-list/sales-list.page').then((m) => m.SalesListPage),
        data: {
          title: 'Historial de Ventas',
        },
      },
      {
        path: 'ver-venta/:id',
        loadComponent: () =>
          import('./sales/pages/sale-view/sale-view.component').then((m) => m.SaleViewComponent),
        data: {
          title: 'Ver Venta',
        },
      },
      {
        path: 'historial-cotizaciones',
        loadComponent: () =>
          import('./quotation/pages/quotation-list.page').then((m) => m.QuotationListPage),
        data: {
          title: 'Cotizaciones',
        },
      },
      {
        path: 'nueva-cotizacion',
        loadComponent: () =>
          import('./quotation/pages/quotation-new-edit.page').then((m) => m.QuotationNewEditPage),
        data: {
          title: 'Nueva Cotización',
        },
      },
      {
        path: 'editar-cotizacion/:id',
        loadComponent: () =>
          import('./quotation/pages/quotation-new-edit.page').then((m) => m.QuotationNewEditPage),
        data: {
          title: 'Editar Cotización',
        },
      },
      {
        path: 'historial-guias-remision',
        loadComponent: () =>
          import('./shipping-guide/pages/shipping-guide-list.page').then(
            (m) => m.ShippingGuideListPage,
          ),
        data: {
          title: 'Guías de Remisión',
        },
      },
      {
        path: 'series',
        loadComponent: () => import('./series/pages/series.page').then((m) => m.SeriesPage),
        data: {
          title: 'Series',
        },
      },
      {
        path: 'productos-sucursal',
        loadComponent: () =>
          import('./product-sucursal/pages/product-sucursal/product-sucursal').then(
            (m) => m.ProductoSucursal,
          ),
        data: {
          title: 'Stock por Sucursal',
        },
      },
      {
        path: 'almacenes',
        loadComponent: () =>
          import('./almacen/pages/almacen/almacen').then((m) => m.AlmacenComponent),
        data: {
          title: 'Almacenes',
        },
      },
      {
        path: 'almacen-stock/:id',
        loadComponent: () =>
          import('./almacen/pages/almacen-stock/almacen-stock').then(
            (m) => m.AlmacenStockComponent,
          ),
        data: {
          title: 'Stock del Almacén',
        },
      },
      {
        path: 'kardex',
        loadComponent: () =>
          import('./kardex/pages/kardex-report/kardex-report').then((m) => m.KardexReportComponent),
        data: {
          title: 'Kardex de Inventario',
        },
      },
      {
        path: 'movimientos',
        loadComponent: () =>
          import('./movimiento/pages/movimiento-list/movimiento-list').then(
            (m) => m.MovimientoListComponent,
          ),
        data: {
          title: 'Movimientos',
        },
      },
      {
        path: 'nuevo-movimiento',
        loadComponent: () =>
          import('./movimiento/pages/movimiento-form/movimiento-form').then(
            (m) => m.MovimientoFormComponent,
          ),
        data: {
          title: 'Nuevo Movimiento',
        },
      },
      {
        path: 'editar-movimiento/:id',
        loadComponent: () =>
          import('./movimiento/pages/movimiento-form/movimiento-form').then(
            (m) => m.MovimientoFormComponent,
          ),
        data: {
          title: 'Editar Movimiento',
        },
      },
    ],
  },
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
    data: {
      title: 'Login Page',
    },
  },
  { path: '**', redirectTo: 'dashboard' },
];
