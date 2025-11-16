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
    name: 'Ventas',
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
        name: 'Listado de Ventas',
        url: '/listado-ventas',
        icon: 'nav-icon-bullet',
      },
    ],
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
