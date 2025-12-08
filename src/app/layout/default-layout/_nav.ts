import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    title: true,
    name: 'Menu',
  },
  {
    name: 'Mantenimiento',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Proveedor',
        url: '/proveedores',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Tipo Documento',
        url: '/tipo-documento',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Cliente',
        url: '/clientes',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Producto',
        url: '/productos',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Metodo de Pago',
        url: '/metodo-pago',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Categoria',
        url: '/categorias',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Sucursal',
        url: '/sucursales',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Moneda',
        url: '/monedas',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Documento',
        url: '/documentos',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Empresa',
        url: '/empresas',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Compania',
        url: '/companias',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Unidad de Medida',
        url: '/unidad-medida',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Usuario',
        url: '/usuario',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Rol',
        url: '/rol',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    title: true,
    name: 'Compras',
  },
  {
    name: 'Compras',
    iconComponent: { name: 'cil-cart' },
    children: [
      {
        name: 'Nueva Compra',
        url: '/compras',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Listado de Compras',
        url: '/listado-compras',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    title: true,
    name: 'Comercial',
  },
  {
    name: 'Ventas',
    iconComponent: { name: 'cil-cash' },
    children: [
      {
        name: 'Nueva Venta',
        url: '/ventas',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Historial de Ventas',
        url: '/listado-ventas',
        icon: 'nav-icon-bullet',
      },
    ],
  },
  {
    name: 'Cotizaciones',
    iconComponent: { name: 'cil-file' },
    children: [
      {
        name: 'Nueva Cotización',
        url: '/cotizaciones',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Listado de Cotizaciones',
        url: '/historial-cotizaciones',
        icon: 'nav-icon-bullet',
      }
    ],
  },
  {
    name: 'Guías de Remisión',
    iconComponent: { name: 'cil-truck' },
    children: [
      {
        name: 'Nueva Guía Remisión',
        url: '/guia-remision',
        icon: 'nav-icon-bullet',
      },
      {
        name: 'Listado de Guía Remisión',
        url: '/historial-guias-remision',
        icon: 'nav-icon-bullet',
      }]
  },
  {
    title: true,
    name: 'Configuración',
  },
  {
    name: 'Series',
    url: '/series',
    iconComponent: { name: 'cil-list-numbered' },
  },
  {
    title: true,
    name: 'Links',
    class: 'mt-auto',
  },
  {
    name: 'Ayuda',
    url: '/ayuda',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' },
  },
];
