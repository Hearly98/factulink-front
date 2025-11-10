import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
  },
  {
    title: true,
    name: 'Menu'
  },
    {
    name: 'Mantenimiento',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Proveedores',
        url: '/proveedores',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Clientes',
        url: '/clientes',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Productos',
        url: '/productos',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Categorias',
        url: '/categorias',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Compras'
  },
       {
    name: 'Compras',
    iconComponent: { name: 'cil-cart' },
    children: [
      {
        name: 'Nueva Compra',
        url: '/compras',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Listado de Compras',
        url: '/listado-compras',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    title: true,
    name: 'Ventas'
  },
  {
    name: 'Ventas',
    iconComponent: { name: 'cil-cash' },
    children: [
      {
        name: 'Nueva Venta',
        url: '/ventas',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Listado de Ventas',
        url: '/listado-ventas',
        icon: 'nav-icon-bullet'
      },
    ]
  },
  {
    title: true,
    name: 'Links',
    class: 'mt-auto'
  },
  {
    name: 'Ayuda',
    url: '/ayuda',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];
