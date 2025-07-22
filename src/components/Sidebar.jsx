import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Menu, 
  CreditCard, 
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    name: 'Mesas',
    href: '/tables',
    icon: Users,
  },
  {
    name: 'Pedidos',
    href: '/orders',
    icon: ShoppingCart,
  },
  {
    name: 'Cardápio',
    href: '/menu',
    icon: Menu,
  },
  {
    name: 'Pagamentos',
    href: '/payments',
    icon: CreditCard,
  },
  {
    name: 'Relatórios',
    href: '/reports',
    icon: BarChart3,
  },
  {
    name: 'Configurações',
    href: '/settings',
    icon: Settings,
  },
];

/**
 * Sidebar: Navegação lateral do sistema, exibe links para as principais páginas do backoffice.
 * Não recebe props.
 */
const Sidebar = () => {
  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-sidebar-foreground">
          Comandas PWA
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <Button variant="ghost" className="w-full justify-start gap-3">
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Sidebar; 